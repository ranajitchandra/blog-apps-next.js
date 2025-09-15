// Update this file: app/create-post/page.js

"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function CreatePost() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Form data
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryID, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState(''); // Store uploaded image URL
    console.log("category---", categoryID);
    // Loading states
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    
    const [categories, setCategories] = useState([]);
    // console.log("categories", categories);

    // Check if user can create posts
    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/login');
            return;
        }

        if (session.user.role !== 'author' && session.user.role !== 'admin') {
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'Only authors can create posts',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            }).then(() => {
                router.push('/');
            });
            return;
        }

        fetchCategories();
    }, [session, status, router]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load categories',
                confirmButtonColor: '#3085d6'
            });
        }
    };

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid File Type',
                text: 'Please select a JPEG, PNG, or WebP image',
                confirmButtonColor: '#3085d6'
            });
            // Clear the input
            e.target.value = '';
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            Swal.fire({
                icon: 'error',
                title: 'File Too Large',
                text: 'Please select an image smaller than 5MB',
                confirmButtonColor: '#3085d6'
            });
            // Clear the input
            e.target.value = '';
            return;
        }

        setIsUploadingImage(true);

        try {
            // Create form data for file upload
            const formData = new FormData();
            formData.append('file', file);

            // Upload to our API
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setImageUrl(data.imageUrl); // Save the image URL
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Image uploaded successfully!',
                    timer: 2000,
                    showConfirmButton: false,
                    position: 'top-end',
                    toast: true
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Upload Failed',
                    text: data.error || 'Failed to upload image',
                    confirmButtonColor: '#3085d6'
                });
            }
        } catch (error) {
            console.error('Upload error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Upload Error',
                text: 'Failed to upload image. Please try again.',
                confirmButtonColor: '#3085d6'
            });
        } finally {
            setIsUploadingImage(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please fill in title and content',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content,
                    categoryID: categoryID,
                    featuredImage: imageUrl // Include the uploaded image URL
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Post created successfully!',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'View Post'
                }).then(() => {
                    router.push(`/dashboard`);
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Creation Failed',
                    text: data.error || 'Failed to create post',
                    confirmButtonColor: '#3085d6'
                });
            }
        } catch (error) {
            console.error('Error creating post:', error);
            Swal.fire({
                icon: 'error',
                title: 'Something Went Wrong',
                text: 'An unexpected error occurred. Please try again.',
                confirmButtonColor: '#3085d6'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!session || (session.user.role !== 'author' && session.user.role !== 'admin')) {
        return null;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1>Create New Post</h1>

            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div style={{ marginBottom: '20px' }}>
                    <label>Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter post title"
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px'
                        }}
                        required
                    />
                </div>

                {/* Image Upload */}
                <div style={{ marginBottom: '20px' }}>
                    <label>Featured Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploadingImage}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                    {isUploadingImage && <p>Uploading image...</p>}

                    {/* Show uploaded image preview */}
                    {imageUrl && (
                        <div style={{ marginTop: '10px' }}>
                            <img
                                src={imageUrl}
                                alt="Preview"
                                style={{
                                    maxWidth: '300px',
                                    maxHeight: '200px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setImageUrl('')}
                                style={{
                                    marginLeft: '10px',
                                    padding: '5px 10px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Remove Image
                            </button>
                        </div>
                    )}
                </div>

                {/* Category */}
                <div style={{ marginBottom: '20px' }}>
                    <label>Category</label>
                    <select
                        value={categoryID}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Content */}
                <div style={{ marginBottom: '20px' }}>
                    <label>Content *</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post content here..."
                        rows="10"
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px',
                            fontFamily: 'Arial, sans-serif'
                        }}
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || isUploadingImage}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: isLoading ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? 'Creating Post...' : 'Create Post'}
                </button>
            </form>
        </div>
    );
}