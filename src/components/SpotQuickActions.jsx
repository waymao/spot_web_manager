
import ROSLIB from 'roslib';
import { useState, useEffect } from 'react';


const ActionButton = ({ loadingStates, label, onClick, disabled, color = 'blue', showLoading = false, loadingKey = null }) => {
    const isLoading = loadingKey && loadingStates[loadingKey];

    const colorClasses = {
        red: 'bg-red-500 hover:bg-red-600',
        blue: 'bg-blue-500 hover:bg-blue-600',
        yellow: 'bg-yellow-500 hover:bg-yellow-600',
        green: 'bg-green-500 hover:bg-green-600'
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`relative px-4 py-2 ${colorClasses[color]} text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors`}
        >
            {isLoading && (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            )}
            {label}
        </button>
    );
};

export const SpotQuickActions = ({ spotConfig, ros, connected, fiducialLoc }) => {
    const { spotIP, spotName, spotIntialLoc, spotDockId } = spotConfig;
    const [loadingStates, setLoadingStates] = useState({
        dock: false,
        undock: false,
        stand: false,
        navigate: false
    });

    // estop logic
    const [estopInfo, setEstopInfo] = useState(
        {estopped: false, estop_status: ""}
    );
    useEffect(() => {
        if (!ros || !connected) {
            setEstopInfo(null);
            return;
        }

        const estopTopic = new ROSLIB.Topic({
            ros: ros,
            name: `/${spotName}/status/estop`,
            messageType: 'spot_msgs/msg/EStopStateArray'
        });

        estopTopic.subscribe((message) => {
            // console.log(message);
            // console.log(message.estop_states.map(state => state.state != 2))
            const estopped = message.estop_states.some(state => state.state != 2)
            const estop_reasons = message.estop_states.filter(state => state.state != 2).map(state => state.name)
            
            setEstopInfo({
                estopped,
                estop_message: estopped ? "Engaged: " + estop_reasons.join("; ") : "Off"
            });
        });

        // Cleanup function - unsubscribe when component unmounts or dependencies change
        return () => {
            if (estopTopic) estopTopic.unsubscribe();
        };
    }, [ros, connected, spotName]);

    // motor state
    const [motorStateInfo, setMotorStateInfo] = useState(null);
    useEffect(() => {
        if (!ros || !connected) {
            setMotorStateInfo(null);
            return;
        }

        const motorStateTopic = new ROSLIB.Topic({
            ros: ros,
            name: `/${spotName}/status/power_states`,
            messageType: 'spot_msgs/msg/PowerState'
        });

        motorStateTopic.subscribe((message) => {
            // console.log(message);
            // console.log(message.estop_states.map(state => state.state != 2))
            setMotorStateInfo(message);
        });

        // Cleanup function - unsubscribe when component unmounts or dependencies change
        return () => {
            if (motorStateTopic) motorStateTopic.unsubscribe();
        };
    }, [ros, connected, spotName]);


    // battery topic
    const [batteryInfo, setBatteryInfo] = useState(null);
    useEffect(() => {
        if (!ros || !connected) {
            setBatteryInfo(null);
            return;
        }

        const batteryTopic = new ROSLIB.Topic({
            ros: ros,
            name: `/${spotName}/status/battery_states`,
            messageType: 'spot_msgs/msg/BatteryStateArray'
        });

        batteryTopic.subscribe((message) => {
            setBatteryInfo(message);
        });

        // Cleanup function - unsubscribe when component unmounts or dependencies change
        return () => {
            if (batteryTopic) batteryTopic.unsubscribe();
        };
    }, [ros, connected, spotName]);

    const setLoading = (action, isLoading) => {
        setLoadingStates(prev => ({ ...prev, [action]: isLoading }));
    };

    const dock = () => {
        if (!ros || !connected || loadingStates.dock) {
            console.error('ROS not connected or already loading');
            return;
        }

        setLoading('dock', true);

        const dockService = new ROSLIB.Service({
            ros: ros,
            name: `/${spotName}/dock`,
            serviceType: 'spot_msgs/srv/Dock'
        });

        const request = new ROSLIB.ServiceRequest({
            dock_id: spotDockId
        });

        dockService.callService(
            request,
            (result) => {
                console.log(`${spotName} dock successful:`, result);
                setLoading('dock', false);
            },
            (error) => {
                console.error(`${spotName} dock failed:`, error);
                setLoading('dock', false);
            }
        );
    };

    const triggerFunc = (topicName) => {
        if (!ros || !connected || loadingStates[topicName]) {
            console.error('ROS not connected or already loading');
            return;
        }

        setLoading(topicName, true);

        const service = new ROSLIB.Service({
            ros: ros,
            name: `/${spotName}/${topicName}`,
            serviceType: 'std_srvs/srv/Trigger'
        });

        const request = new ROSLIB.ServiceRequest({});

        service.callService(
            request,
            (result) => {
                console.log(`${spotName} ${topicName} successful:`, result);
                setLoading(topicName, false);
            },
            (error) => {
                console.error(`${spotName} ${topicName} failed:`, error);
                setLoading(topicName, false);
            }
        );
    };

    const goToPose = (loc) => {
        if (!ros || !connected || loadingStates.navigate) {
            console.error('ROS not connected or already loading');
            return;
        }

        setLoading('navigate', true);

        const navTopic = new ROSLIB.Topic({
            ros: ros,
            name: `/${spotName}/navigate_to_any_pose`,
            messageType: 'geometry_msgs/PoseStamped'
        });

        // Assuming spotIntialLoc is [x, y, theta]
        const [x, y, theta] = loc;

        const message = new ROSLIB.Message({
            header: {
                frame_id: 'map'
            },
            pose: {
                position: {
                    x: x,
                    y: y,
                    z: 0
                },
                orientation: {
                    x: 0,
                    y: 0,
                    z: Math.sin(theta / 2),
                    w: Math.cos(theta / 2)
                }
            }
        });

        // Publish message 10 times with 0.2s interval
        const messageInterval = 200; // ms
        const messageDuration = 4000; // ms
        for (let i = 0; i < messageDuration / messageInterval; i++) {
            setTimeout(() => {
                navTopic.publish(message);
                console.log(`${spotName} navigation to initial pose published (${i + 1}/10):`, message);
            }, i * messageInterval);
        }

        // Clear loading after all publishes complete (10 * 0.2s = 2s)
        setTimeout(() => {
            setLoading('navigate', false);
        }, messageDuration);
    };

    const anyLoading = Object.values(loadingStates).some(state => state);

    // Reusable Action Button Component

    // Button configurations
    const buttonGroups = [
        {
            name: 'Emergency & Power',
            buttons: [
                {
                    label: 'E-Stop',
                    onClick: () => triggerFunc("estop/gentle"),
                    disabled: !connected || estopInfo?.estopped,
                    color: 'red'
                },
                {
                    label: 'Soft E-Stop Release',
                    onClick: () => triggerFunc("estop/release"),
                    disabled: !connected || !estopInfo?.estopped,
                    color: 'red'
                },
                {
                    label: 'Power Off',
                    onClick: () => triggerFunc("power_off"),
                    disabled: !connected || estopInfo?.estopped,
                    color: 'red'
                },
                {
                    label: 'Power On',
                    onClick: () => triggerFunc("power_on"),
                    disabled: !connected || estopInfo?.estopped,
                    color: 'red'
                }
            ]
        },
        {
            name: 'Actions',
            buttons: [
                {
                    label: 'Close Gripper',
                    onClick: () => triggerFunc('close_gripper'),
                    disabled: !connected || estopInfo?.estopped,
                    color: 'blue'
                },
                {
                    label: 'Open Gripper',
                    onClick: () => triggerFunc('open_gripper'),
                    disabled: !connected || estopInfo?.estopped,
                    color: 'blue'
                },
                {
                    label: 'Stow',
                    onClick: () => triggerFunc('arm_stow'),
                    disabled: !connected || estopInfo?.estopped,
                    color: 'blue'
                },
                {
                    label: 'Dock',
                    onClick: dock,
                    disabled: !connected || loadingStates.dock || estopInfo?.estopped,
                    color: 'blue',
                    loadingKey: 'dock'
                },
                {
                    label: 'Un-dock',
                    onClick: () => triggerFunc('undock'),
                    disabled: !connected || loadingStates.undock || estopInfo?.estopped,
                    color: 'yellow',
                    loadingKey: 'undock'
                },
                {
                    label: 'Stand',
                    onClick: () => triggerFunc('stand'),
                    disabled: !connected || loadingStates.stand || estopInfo?.estopped,
                    color: 'yellow',
                    loadingKey: 'stand'
                },
                {
                    label: 'Sit',
                    onClick: () => triggerFunc('sit'),
                    disabled: !connected || estopInfo?.estopped,
                    color: 'yellow'
                },
                {
                    label: 'InitialPose',
                    onClick: () => goToPose(spotIntialLoc),
                    disabled: !connected || loadingStates.navigate || estopInfo?.estopped,
                    color: 'green',
                    loadingKey: 'navigate'
                },
                {
                    label: 'Fiducial Pose',
                    onClick: () => goToPose(fiducialLoc),
                    disabled: !connected || loadingStates.navigate || estopInfo?.estopped,
                    color: 'green',
                    loadingKey: 'navigate'
                }
            ]
        }
    ];

    return (
        <div className="relative flex flex-col gap-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
            {/* Loading Overlay */}
            {anyLoading && (
                <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center z-10">
                    <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-lg shadow-lg">
                        <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-semibold text-gray-700">Processing...</span>
                    </div>
                </div>
            )}
            <p className="flex gap-2">
                <span className="font-semibold text-gray-700">
                    {spotName}
                </span>
                <span className="font-semibold text-gray-700">
                    Battery: {!batteryInfo ? "Loading...":
                    `${batteryInfo.battery_states[0].charge_percentage}%; Runtime: ${(batteryInfo.battery_states[0].estimated_runtime.sec / 60).toFixed(2)} min; ` +
                    `Voltage: ${batteryInfo.battery_states[0].voltage.toFixed(2)}V; Current: ${batteryInfo.battery_states[0].current.toFixed(2)}A`
                    }
                </span>
            </p>
            <p>E-Stop: <span className={estopInfo?.estopped ? "text-red-500" : "text-gray-500"}>{estopInfo?.estop_message ?? "Loading"}</span>;
                Motor: {motorStateInfo?.motor_power_state == 2 ? "On" : "Off"}</p>

            {/* Render button groups */}
            {buttonGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="flex gap-2">
                    {group.buttons.map((button, buttonIndex) => (
                        <ActionButton
                            loadingStates={loadingStates}
                            key={buttonIndex}
                            label={button.label}
                            onClick={button.onClick}
                            disabled={button.disabled}
                            color={button.color}
                            loadingKey={button.loadingKey}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}
