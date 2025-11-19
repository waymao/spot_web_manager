import ROSLIB from 'roslib';
import { useState } from 'react';
import { RosType } from '../types/ros';

interface DirectionalControlProps {
    spotName: string;
    ros: RosType;
    connected: boolean;
    disabled: boolean;
}

export const DirectionalControl = ({ spotName, ros, connected, disabled }: DirectionalControlProps) => {
    const [activeDirection, setActiveDirection] = useState<string | null>(null);

    const publishTwist = (linear_x: number, linear_y: number, angular_z: number) => {
        if (!ros || !connected) {
            console.error('ROS not connected');
            return;
        }

        const cmdVelTopic = new ROSLIB.Topic({
            ros: ros,
            name: `/${spotName}/cmd_vel`,
            messageType: 'geometry_msgs/Twist'
        });

        const message = new ROSLIB.Message({
            linear: {
                x: linear_x,
                y: linear_y,
                z: 0
            },
            angular: {
                x: 0,
                y: 0,
                z: angular_z
            }
        });

        cmdVelTopic.publish(message);
        console.log(`Published to /${spotName}/cmd_vel:`, message);
    };

    const handleDirectionPress = (direction: string, linear_x: number, linear_y: number, angular_z: number) => {
        setActiveDirection(direction);
        publishTwist(linear_x, linear_y, angular_z);
    };

    const handleDirectionRelease = () => {
        setActiveDirection(null);
        publishTwist(0, 0, 0); // Stop the robot
    };

    interface DirectionButtonProps {
        direction: string;
        label: string;
        linear_x: number;
        linear_y: number;
        angular_z: number;
        className: string;
    }

    const DirectionButton = ({ direction, label, linear_x, linear_y, angular_z, className }: DirectionButtonProps) => {
        const isActive = activeDirection === direction;

        return (
            <button
                onMouseDown={() => handleDirectionPress(direction, linear_x, linear_y, angular_z)}
                onMouseUp={handleDirectionRelease}
                onMouseLeave={handleDirectionRelease}
                onTouchStart={() => handleDirectionPress(direction, linear_x, linear_y, angular_z)}
                onTouchEnd={handleDirectionRelease}
                disabled={!connected || disabled}
                className={`
                    ${className}
                    px-6 py-4 font-bold text-white rounded transition-all
                    ${isActive ? 'bg-blue-700 scale-95' : 'bg-blue-500 hover:bg-blue-600'}
                    disabled:bg-gray-400 disabled:cursor-not-allowed
                    select-none touch-none
                `}
            >
                {label}
            </button>
        );
    };

    return (
        <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-300">
            <div className="text-sm font-semibold text-gray-700 mb-2">
                Directional Control - {spotName}
            </div>

            {/* Control Grid */}
            <div className="flex flex-col gap-2">
                {/* Top Row - Forward */}
                <div className="flex justify-center gap-2">
                    <DirectionButton
                        direction="rotate-left"
                        label="↶"
                        linear_x={0}
                        linear_y={0}
                        angular_z={0.5}
                        className="w-20"
                    />
                    <DirectionButton
                        direction="forward"
                        label="↑"
                        linear_x={0.5}
                        linear_y={0}
                        angular_z={0}
                        className="w-20"
                    />
                    <DirectionButton
                        direction="rotate-right"
                        label="↷"
                        linear_x={0}
                        linear_y={0}
                        angular_z={-0.5}
                        className="w-20"
                    />
                </div>

                {/* Middle Row - Strafe Left, Rotate Left, Stop, Rotate Right, Strafe Right */}
                <div className="flex justify-center gap-2">
                    <DirectionButton
                        direction="strafe-left"
                        label="⇐"
                        linear_x={0}
                        linear_y={0.5}
                        angular_z={0}
                        className="w-20"
                    />
                    <button
                        onClick={() => publishTwist(0, 0, 0)}
                        disabled={!connected || disabled}
                        className="w-20 px-4 py-4 font-bold text-white rounded bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        ⏹
                    </button>
                    <DirectionButton
                        direction="strafe-right"
                        label="⇒"
                        linear_x={0}
                        linear_y={-0.5}
                        angular_z={0}
                        className="w-20"
                    />
                </div>

                {/* Bottom Row - Backward */}
                <div className="flex justify-center gap-2">
                    <DirectionButton
                        direction="backward"
                        label="↓"
                        linear_x={-0.5}
                        linear_y={0}
                        angular_z={0}
                        className="w-20"
                    />
                </div>
            </div>

            <div className="text-xs text-gray-500 mt-2">
                Hold button to move, release to stop
            </div>
        </div>
    );
};
