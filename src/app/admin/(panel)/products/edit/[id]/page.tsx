'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import axiosClient from '@/lib/axiosClient';
import Swal from 'sweetalert2';

interface ProductSpec {
    id?: number;
    specName: string;
    specValue: string;
}

interface ProductImage {
    imageContent: string;
    isMain: boolean;
    sortOrder: number;
}

interface ProductData {
    productName: string;
    price: number;
    stock: number;
    categoryId: number;
    brandId: number;
    discount: number;
    isActive: boolean;
    isFeatured: boolean;
    description: string;
    specs: string;
    productSpecs: ProductSpec[];
    newImages: ProductImage[];
    specIdsToRemove: number[];
    imageIdsToRemove?: number[];
}

interface Category {
    id: number;
    categoryName: string;
}

interface Brand {
    id: number;
    brandName: string;
}

export default function EditProductPage() {
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const productId = Number(id);
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<ProductData | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [oldImages, setOldImages] = useState<{
        imageId: number;
        imageUrl: string;
        isMain: boolean;
        sortOrder: number
    }[]>([]);
    const [imageIdsToRemove, setImageIdsToRemove] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, catRes, brandRes] = await Promise.all([
                    axiosClient.get(`/api/v1/products/${productId}`),
                    axiosClient.get('/api/v1/categories'),
                    axiosClient.get('/api/v1/brands')
                ]);

                const p = productRes.data;

                setProduct({
                    productName: p.productName,
                    price: p.price,
                    stock: p.stock,
                    categoryId: p.categoryId,
                    brandId: p.brandId,
                    discount: p.discount,
                    isActive: p.isActive,
                    isFeatured: p.isFeatured,
                    description: p.description,
                    specs: p.specs,
                    productSpecs: p.productSpecs || [],
                    newImages: [],
                    specIdsToRemove: [],
                });

                setOldImages(p.images || []);
                setCategories(catRes.data);
                setBrands(brandRes.data);
            } catch {
                Swal.fire('Lỗi', 'Không tải được dữ liệu sản phẩm', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (!isNaN(productId)) {
            fetchData();
        }
    }, [productId]);

    const handleSpecChange = <K extends keyof ProductSpec>(i: number, key: K, value: ProductSpec[K]) => {
        if (!product) return;
        const updated = [...product.productSpecs];
        updated[i][key] = value;
        setProduct({...product, productSpecs: updated});
    };

    const handleAddSpec = () => {
        if (!product) return;
        setProduct({...product, productSpecs: [...product.productSpecs, {specName: '', specValue: ''}]});
    };

    const handleRemoveSpec = (index: number) => {
        if (!product) return;
        const spec = product.productSpecs[index];
        const updatedSpecs = product.productSpecs.filter((_, i) => i !== index);
        const removeIds = spec.id ? [...product.specIdsToRemove, spec.id] : product.specIdsToRemove;
        setProduct({...product, productSpecs: updatedSpecs, specIdsToRemove: removeIds});
    };

    const handleImageUpload = (index: number, file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            if (!product) return;
            const updated = [...product.newImages];
            updated[index].imageContent = base64;
            setProduct({...product, newImages: updated});
        };
        reader.readAsDataURL(file);
    };

    const handleAddImage = () => {
        if (!product) return;
        setProduct({
            ...product,
            newImages: [...product.newImages, {imageContent: '', isMain: false, sortOrder: product.newImages.length}],
        });
    };

    const handleSubmit = async () => {
        try {
            await axiosClient.put(`/api/v1/products/${productId}`, {
                ...product,
                imageIdsToRemove,
            });
            Swal.fire('Thành công', 'Đã cập nhật sản phẩm', 'success');
            router.push('/admin/products');
        } catch {
            Swal.fire('Lỗi', 'Không thể cập nhật sản phẩm', 'error');
        }
    };

    if (loading || !product) return <div className="p-6">⏳ Đang tải dữ liệu...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow space-y-6">
            <h1 className="text-2xl font-bold mb-4">🛠 Chỉnh sửa sản phẩm</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="font-medium">Tên sản phẩm</label>
                    <input
                        value={product.productName}
                        onChange={(e) => setProduct({...product, productName: e.target.value})}
                        className="border p-2 w-full rounded"
                    />
                </div>

                <div>
                    <label className="font-medium">Danh mục</label>
                    <select
                        value={product.categoryId}
                        onChange={(e) => setProduct({...product, categoryId: +e.target.value})}
                        className="border p-2 w-full rounded"
                    >
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.categoryName}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="font-medium">Thương hiệu</label>
                    <select
                        value={product.brandId}
                        onChange={(e) => setProduct({...product, brandId: +e.target.value})}
                        className="border p-2 w-full rounded"
                    >
                        {brands.map((b) => (
                            <option key={b.id} value={b.id}>{b.brandName}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="font-medium">Giá</label>
                    <input type="number" value={product.price}
                           onChange={(e) => setProduct({...product, price: +e.target.value})}
                           className="border p-2 w-full rounded"/>
                </div>

                <div>
                    <label className="font-medium">Tồn kho</label>
                    <input type="number" value={product.stock}
                           onChange={(e) => setProduct({...product, stock: +e.target.value})}
                           className="border p-2 w-full rounded"/>
                </div>

                <div>
                    <label className="font-medium">Giảm giá (%)</label>
                    <input type="number" min={0} max={100} value={product.discount}
                           onChange={(e) => setProduct({...product, discount: +e.target.value})}
                           className="border p-2 w-full rounded"/>
                </div>
            </div>

            <div>
                <label className="font-medium">Mô tả</label>
                <textarea
                    value={product.description}
                    onChange={(e) => setProduct({...product, description: e.target.value})}
                    className="border p-2 w-full rounded"
                />
            </div>

            <div className="flex items-center gap-4">
                <label>
                    <input type="checkbox" checked={product.isActive}
                           onChange={(e) => setProduct({...product, isActive: e.target.checked})}/> Hiển thị sản phẩm
                </label>
                <label>
                    <input type="checkbox" checked={product.isFeatured}
                           onChange={(e) => setProduct({...product, isFeatured: e.target.checked})}/> Gợi ý nổi bật
                </label>
            </div>

            <div>
                <h3 className="font-semibold">Thông số kỹ thuật</h3>
                {product.productSpecs.map((s, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                        <input value={s.specName} onChange={(e) => handleSpecChange(i, 'specName', e.target.value)}
                               className="border p-2 rounded w-1/2" placeholder="Tên"/>
                        <input value={s.specValue} onChange={(e) => handleSpecChange(i, 'specValue', e.target.value)}
                               className="border p-2 rounded w-1/2" placeholder="Giá trị"/>
                        <button onClick={() => handleRemoveSpec(i)} className="text-red-600">🗑</button>
                    </div>
                ))}
                <button onClick={handleAddSpec} className="text-blue-600 mt-2">+ Thêm thông số</button>
            </div>

            <div>
                <h3 className="font-semibold">Ảnh hiện tại</h3>
                {oldImages.map((img, index) => (
                    <div key={img.imageId || `old-img-${index}`} className="flex items-center gap-2 mb-2">
                        {img.imageUrl ? (
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${img.imageUrl}`}
                                alt={`Ảnh ${index}`}
                                className="w-24 h-24 object-cover border rounded"
                            />
                        ) : (
                            <div
                                className="w-24 h-24 bg-gray-200 flex items-center justify-center text-sm text-gray-600 border rounded">
                                Không có ảnh
                            </div>
                        )}
                        <span>Thứ tự: {img.sortOrder}</span>
                        <span>{img.isMain ? '✅ Chính' : ''}</span>
                        <button
                            onClick={() => {
                                setOldImages(oldImages.filter((im) => im.imageId !== img.imageId));
                                setImageIdsToRemove([...imageIdsToRemove, img.imageId]);
                            }}
                            className="text-red-600"
                        >🗑 Xoá
                        </button>
                    </div>
                ))}
            </div>

            <div>
                <h3 className="font-semibold">Ảnh mới</h3>
                {product.newImages.map((img, i) => (
                    <div key={i} className="flex gap-2 mb-2 items-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files && handleImageUpload(i, e.target.files[0])}
                        />
                        <input
                            type="number"
                            value={img.sortOrder}
                            onChange={(e) => {
                                const updated = [...product.newImages];
                                updated[i].sortOrder = +e.target.value;
                                setProduct({...product, newImages: updated});
                            }}
                            className="w-16 border p-2 rounded"
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={img.isMain}
                                onChange={(e) => {
                                    const updated = [...product.newImages];
                                    updated[i].isMain = e.target.checked;
                                    setProduct({...product, newImages: updated});
                                }}
                            /> Chính
                        </label>
                    </div>
                ))}
                <button onClick={handleAddImage} className="text-blue-600 mt-2">+ Thêm ảnh</button>
            </div>

            <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                ✅ Lưu thay đổi
            </button>
        </div>
    );
}