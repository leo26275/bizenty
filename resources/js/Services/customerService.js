import apiService from '@/Services/apiConfig';

export const customerGetAll = () => {
    return apiService.get('/customers/all');
}
