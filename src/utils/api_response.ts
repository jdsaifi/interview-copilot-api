export class ApiResponse {
    status: string;
    data: any;
    metadata!: object;
    links!: object;
    constructor(data: any = [], metadata = {}, links = {}) {
        this.status = 'success';
        this.data = Array.isArray(data) ? data : [data];

        if (Object.keys(metadata).length) {
            this.metadata = metadata;
        }
    }
}
