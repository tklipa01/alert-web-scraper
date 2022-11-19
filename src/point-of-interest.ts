export class PointOfInterest {
    public name: string
    public selector: string;
    public oldHtml: string | undefined;
    public notificationType: NotificationType

    constructor(name: string, selector: string, notificationType: NotificationType) {
        this.name = name;
        this.selector = selector;
        this.notificationType = notificationType;
        this.oldHtml = undefined;
    }
}

export enum NotificationType {
    Found = 0,
    NotFound = 1,
    Changed = 2
}