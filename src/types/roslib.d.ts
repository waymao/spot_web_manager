declare module 'roslib' {
  export class Ros {
    constructor(options: { url: string });
    on(event: 'connection', callback: () => void): void;
    on(event: 'error', callback: (error: unknown) => void): void;
    on(event: 'close', callback: () => void): void;
    close(): void;
    getTopics(
      callback: (result: { topics: string[]; types: string[] }) => void,
      errorCallback: (error: unknown) => void
    ): void;
    getServices(
      callback: (services: string[]) => void,
      errorCallback: (error: unknown) => void
    ): void;
    getServiceType(
      service: string,
      callback: (type: string) => void,
      errorCallback: (error: unknown) => void
    ): void;
  }

  export class Topic {
    constructor(options: {
      ros: Ros;
      name: string;
      messageType: string;
    });
    subscribe(callback: (message: any) => void): void;
    unsubscribe(): void;
    publish(message: Message): void;
  }

  export class Service {
    constructor(options: {
      ros: Ros;
      name: string;
      serviceType: string;
    });
    callService(
      request: ServiceRequest,
      callback: (response: any) => void,
      errorCallback?: (error: unknown) => void
    ): void;
  }

  export class Message {
    constructor(values?: any);
  }

  export class ServiceRequest {
    constructor(values?: any);
  }

  namespace ROSLIB {
    export { Ros, Topic, Service, Message, ServiceRequest };
  }

  export default ROSLIB;
}
