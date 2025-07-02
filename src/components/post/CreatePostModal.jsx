import React, { useState, useRef } from 'react';
import { X, ChevronDown, Image, Users, Smile, MapPin, MoreHorizontal } from 'lucide-react';
import PostService from '../../services/PostService.js';
import S3Service from '../../services/S3Service.js';
import { Globe, Lock } from 'lucide-react';

const audienceOptions = {
    public: { icon: Globe, label: 'Công khai', value: 'PUBLIC', subtitle: 'Bất kỳ ai trên hoặc ngoài Facebook' },
    friends: { icon: Users, label: 'Bạn bè', value: 'FRIENDS', subtitle: 'Bạn bè của bạn trên Facebook' },
    private: { icon: Lock, label: 'Chỉ mình tôi', value: 'PRIVATE', subtitle: 'Chỉ bạn' },
};

const PostButton = ({ icon, color, label, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
    >
        <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center`}>
            {icon}
        </div>
        <span className="text-gray-700 text-sm">{label}</span>
    </button>
);

export default function CreatePost({ avatar, name, onPostCreated }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [showAudienceDropdown, setShowAudienceDropdown] = useState(false);
    const [selectedAudience, setSelectedAudience] = useState('public');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const fileInputRef = useRef(null);

    const handleInputClick = () => setIsModalOpen(true);
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPostContent('');
        setError('');
        setSelectedImages([]);
        setImagePreviewUrls([]);
        setSelectedAudience('public'); // Reset audience
    };
    
    const handleImageSelect = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        // Validate file types
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const invalidFiles = files.filter(file => !validTypes.includes(file.type));
        
        if (invalidFiles.length > 0) {
            setError('Chỉ chấp nhận file ảnh (JPG, PNG, GIF)');
            return;
        }

        // Validate file size (max 10MB per file)
        const maxSize = 10 * 1024 * 1024; // 10MB
        const oversizedFiles = files.filter(file => file.size > maxSize);
        
        if (oversizedFiles.length > 0) {
            setError('Kích thước file không được vượt quá 10MB');
            return;
        }

        setSelectedImages(files);
        setError('');

        // Create preview URLs
        const previewUrls = files.map(file => URL.createObjectURL(file));
        setImagePreviewUrls(previewUrls);
    };

    const handleRemoveImage = (index) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
        
        // Revoke the removed URL to free memory
        URL.revokeObjectURL(imagePreviewUrls[index]);
        
        setSelectedImages(newImages);
        setImagePreviewUrls(newPreviewUrls);
    };

    const handlePost = async () => {
        if (!postContent.trim() && selectedImages.length === 0) {
            setError('Vui lòng nhập nội dung hoặc chọn ảnh để đăng bài');
            return;
        }
        
        setIsLoading(true);
        setError('');
        
        try {
            // Lấy userId từ localStorage
            const userId = localStorage.getItem('userID');
            
            if (!userId) {
                setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!');
                setIsLoading(false);
                return;
            }

            let imageIds = [];

            // Upload images first if any selected
            if (selectedImages.length > 0) {
                setIsUploadingImages(true);
                try {
                    let uploadResponse;
                    
                    if (selectedImages.length === 1) {
                        // Upload single image using single upload endpoint
                        uploadResponse = await S3Service.uploadFile(selectedImages[0]);
                        console.log('Single upload response:', uploadResponse);
                        
                        if (uploadResponse && uploadResponse.data && uploadResponse.data.id) {
                            imageIds = [uploadResponse.data.id];
                        }
                    } else {
                        // Upload multiple images using multi-upload endpoint
                        uploadResponse = await S3Service.uploadFiles(selectedImages);
                        console.log('Multi upload response:', uploadResponse);
                        
                        if (uploadResponse && uploadResponse.data) {
                            // Extract image IDs from the response
                            if (Array.isArray(uploadResponse.data)) {
                                imageIds = uploadResponse.data.map(image => image.id);
                            } else {
                                imageIds = [uploadResponse.data.id];
                            }
                        }
                    }
                    
                    console.log('Extracted imageIds:', imageIds);
                    
                    if (!uploadResponse || !uploadResponse.data || imageIds.length === 0) {
                        setError('Không thể tải ảnh lên. Vui lòng thử lại!');
                        setIsLoading(false);
                        setIsUploadingImages(false);
                        return;
                    }
                } catch (uploadError) {
                    console.error('Error uploading images:', uploadError);
                    setError('Không thể tải ảnh lên. Vui lòng thử lại!');
                    setIsLoading(false);
                    setIsUploadingImages(false);
                    return;
                }
                setIsUploadingImages(false);
            }

            const postData = {
                textContent: postContent.trim() || '',
                owner: {
                    id: userId
                },
                ownerType: 'PERSON',
                accessMode: audienceOptions[selectedAudience].value,
                status: 'ACTIVE',
                hashTags: [],
                image: imageIds.map(id => ({ id })) 
            };

            const response = await PostService.createPost(postData);
            
            if (response && response.code === 200) {
                // Reset form state
                setPostContent('');
                setSelectedImages([]);
                setImagePreviewUrls([]);
                setError('');
                setSelectedAudience('public');
                if (imagePreviewUrls.length > 0) {
                    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
                }
                setIsModalOpen(false);
                if (onPostCreated) {
                    onPostCreated(response.data);
                }
                // Optional: Show success message
                // alert('Bài viết đã được đăng thành công!');
            } else {
                setError('Không thể đăng bài viết. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Không thể đăng bài viết. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
            setIsUploadingImages(false);
        }
    };

    const handleAudienceSelect = (key) => {
        setSelectedAudience(key);
        setShowAudienceDropdown(false);
    };

    return (
        <div className="mx-auto">
            {/* Main Input Trigger - Updated styling */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <button
                        onClick={handleInputClick}
                        className="flex-1 bg-gray-100 text-gray-600 rounded-3xl px-4 py-3 text-left hover:bg-gray-200 transition-colors"
                        disabled={isLoading}
                    >
                        {name} ơi, bạn đang nghĩ gì thế?
                    </button>
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50 p-4">
                    {showAudienceDropdown && (
                        <div className="fixed inset-0 z-40" onClick={() => setShowAudienceDropdown(false)}></div>
                    )}

                    <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-hidden relative z-50 shadow-xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-black text-lg font-semibold">Tạo bài viết</h2>
                            <button
                                onClick={handleCloseModal}
                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                                disabled={isLoading}
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mx-4 mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* User Info */}
                        <div className="p-4">
                            <div className="flex items-center space-x-3 mb-4 ">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="text-black font-semibold">{name}</div>
                                    <div className="flex items-center space-x-1 relative">
                                        <button
                                            onClick={() => setShowAudienceDropdown(!showAudienceDropdown)}
                                            className="flex items-center space-x-1 border border-gray-300 bg-gray-100 rounded-full px-3 py-1 hover:bg-gray-200 transition-colors"
                                            disabled={isLoading}
                                        >
                                            <span className="w-5 h-5 flex items-center justify-center bg-gray-200 rounded-full">
                                                {React.createElement(audienceOptions[selectedAudience].icon, { className: "w-4 h-4 text-black" })}
                                            </span>
                                            <span className="text-black-600 text-sm font-medium">{audienceOptions[selectedAudience].label}</span>
                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                        </button>

                                        {showAudienceDropdown && (
                                            <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-10 min-w-[220px] py-2">
                                                {Object.entries(audienceOptions).map(([key, option]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => handleAudienceSelect(key)}
                                                        className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                                                            selectedAudience === key ? 'bg-gray-100' : ''
                                                        }`}
                                                        disabled={isLoading}
                                                    >
                                                        <span className={` flex items-center justify-center rounded-full  ${selectedAudience === key ? 'border-black' : 'border-gray-300'} bg-white`}>
                                                            {React.createElement(option.icon, { className: "w-6 h-6 text-black" })}
                                                        </span>
                                                        <div>
                                                            <div className="text-black text-sm font-medium">{option.label}</div>
                                                            <div className="text-gray-500 text-xs">{option.subtitle}</div>
                                                        </div>
                                                        {selectedAudience === key && (
                                                            <div className="ml-auto  bg-blue-500 rounded-full flex items-center justify-center">
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <textarea
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder="Bạn đang nghĩ gì thế?"
                                className="w-full bg-transparent text-black text-lg placeholder-gray-500 resize-none border-none outline-none min-h-[120px]"
                                autoFocus
                                disabled={isLoading}
                            />

                            {/* Image Preview */}
                            {imagePreviewUrls.length > 0 && (
                                <div className="mt-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        {imagePreviewUrls.map((url, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-2 right-2 w-6 h-6 bg-gray-800 bg-opacity-70 text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-opacity"
                                                    disabled={isLoading}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-3 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-black font-medium">Thêm vào bài viết của bạn</span>
                                <div className="flex items-center space-x-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/jpeg,image/jpg,image/png,image/gif"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                        disabled={isLoading}
                                    />
                                    <PostButton 
                                        icon={<Image className="w-4 h-4 text-white" />} 
                                        color="bg-green-500" 
                                        label="" 
                                        onClick={() => fileInputRef.current?.click()} 
                                    />
                                    <PostButton 
                                        icon={<Smile className="w-4 h-4 text-white" />} 
                                        color="bg-yellow-500" 
                                        label="" 
                                        onClick={() => {}} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200">
                            <button
                                onClick={handlePost}
                                disabled={(!postContent.trim() && selectedImages.length === 0) || isLoading}
                                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                                    (postContent.trim() || selectedImages.length > 0) && !isLoading
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {isLoading ? (
                                    isUploadingImages ? 'Đang tải ảnh...' : 'Đang đăng...'
                                ) : 'Đăng'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}