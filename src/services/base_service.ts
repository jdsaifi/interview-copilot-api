import { ApiError } from '../utils/api_error';

class BaseService {
    private model: any;
    constructor(model: any) {
        this.model = model;
    }
    public async getById(id: string) {
        const data = await this.model.findById(id);
        if (!data) {
            throw new ApiError({
                httpCode: 404,
                description: 'Data not found'
            });
        }
        return data;
    }

    public async getOne(condition: Record<string, any>) {
        return await this.model.findOne(condition);
    }

    public async count(condition: Record<string, any>) {
        return await this.model.countDocuments(condition);
    }
}

export default BaseService;
