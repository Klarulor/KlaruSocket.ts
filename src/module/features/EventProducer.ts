export class EventProducer<T_IEVENTS>{

    private eventHandlers: any;

    //@ts-ignore
    public on <K extends keyof T_IEVENTS>(event: K, callback: (...args: T_IEVENTS[K]) => any): void{
        if(!this.eventHandlers[event])
            this.eventHandlers[event] = [];
        this.eventHandlers[event].push(callback);
    }
    //@ts-ignore
    public off <K extends keyof T_IEVENTS>(event: K, callback: (...args: T_IEVENTS[K]) => any): void{
        delete this.eventHandlers[event][this.eventHandlers[event].indexOf(callback)];
    }

    //@ts-ignore
    public invoke<K extends keyof T_IEVENTS>(event: K, ...args: T_IEVENTS[K]){
        for(const k in this.eventHandlers[event]){
            this.eventHandlers[event][k](args);
        }
    }
}