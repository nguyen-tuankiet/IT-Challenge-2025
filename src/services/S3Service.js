import api from './api.js';

class S3Service {
    async uploadFiles(files) {
        try {
            const formData = new FormData();
            
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

            const response = await api.post('/image/upload/multi', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            return response.data;
        } catch (error) {
            console.error('Error uploading files:', error);
            throw error;
        }
    }

    async uploadFile(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/image/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }

    async deleteFile(key) {
        try {
            const response = await api.delete('/image/delete', {
                data: key,
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }
}

export default new S3Service();