'use client'

import {useEffect, useState} from 'react'
import axiosClient from '@/lib/axiosClient'
import Swal from 'sweetalert2'

interface Category {
    id: number
    categoryName: string
}

interface Brand {
    id: number
    brandName: string
}

interface ProductSpec {
    specName: string
    specValue: string
}

interface ProductImage {
    imageContent: string
    isMain: boolean
    sortOrder: number
}

export default function CreateProductPage() {
    const [productName, setProductName] = useState('')
    const [categoryId, setCategoryId] = useState<number | null>(null)
    const [brandId, setBrandId] = useState<number | null>(null)
    const [price, setPrice] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [stock, setStock] = useState(0)
    const [description, setDescription] = useState('')
    const [specs, setSpecs] = useState('')
    const [productSpecs, setProductSpecs] = useState<ProductSpec[]>([])
    const [images, setImages] = useState<ProductImage[]>([])

    const [categories, setCategories] = useState<Category[]>([])
    const [brands, setBrands] = useState<Brand[]>([])

    useEffect(() => {
        axiosClient.get('/api/v1/categories').then(res => setCategories(res.data))
        axiosClient.get('/api/v1/brands').then(res => setBrands(res.data))
    }, [])

    const addSpec = () => {
        setProductSpecs([...productSpecs, {specName: '', specValue: ''}])
    }

    const updateSpec = (index: number, key: keyof ProductSpec, value: string) => {
        setProductSpecs(prev => {
            const updated = [...prev]
            updated[index][key] = value
            return updated
        })
    }

    const removeSpec = (index: number) => {
        setProductSpecs(prev => prev.filter((_, i) => i !== index))
    }

    const addImage = () => {
        setImages(prev => [...prev, {imageContent: '', isMain: false, sortOrder: prev.length}])
    }

    const updateImage = <K extends keyof ProductImage>(index: number, key: K, value: ProductImage[K]) => {
        setImages(prev => {
            const updated = [...prev]
            updated[index][key] = value
            return updated
        })
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleFileChange = (index: number, file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            updateImage(index, 'imageContent', base64);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                productName,
                categoryId,
                brandId,
                price,
                discount,
                stock,
                description,
                specs,
                productSpecs,
                images,
            }

            await axiosClient.post('/api/v1/products', payload)
            Swal.fire('✅ Thành công!', 'Sản phẩm đã được tạo.', 'success')
        } catch (err) {
            Swal.fire('❌ Lỗi', 'Không thể tạo sản phẩm', 'error')
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold">➕ Thêm sản phẩm</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="font-medium">Tên sản phẩm</label>
                    <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)}
                           className="border p-2 w-full rounded"/>
                </div>

                <div>
                    <label className="font-medium">Danh mục</label>
                    <select value={categoryId ?? ''} onChange={(e) => setCategoryId(+e.target.value)}
                            className="border p-2 w-full rounded">
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.categoryName}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="font-medium">Thương hiệu</label>
                    <select value={brandId ?? ''} onChange={(e) => setBrandId(+e.target.value)}
                            className="border p-2 w-full rounded">
                        <option value="">-- Chọn thương hiệu --</option>
                        {brands.map(b => (
                            <option key={b.id} value={b.id}>{b.brandName}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="font-medium">Giá</label>
                    <input type="number" value={price} onChange={(e) => setPrice(+e.target.value)}
                           className="border p-2 w-full rounded"/>
                </div>

                <div>
                    <label className="font-medium">Giảm giá (%)</label>
                    <input type="number" value={discount} onChange={(e) => setDiscount(+e.target.value)}
                           className="border p-2 w-full rounded"/>
                </div>

                <div>
                    <label className="font-medium">Tồn kho</label>
                    <input type="number" value={stock} onChange={(e) => setStock(+e.target.value)}
                           className="border p-2 w-full rounded"/>
                </div>

                <div className="md:col-span-2">
                    <label className="font-medium">Mô tả</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                              className="border p-2 w-full rounded"/>
                </div>

                <div className="md:col-span-2">
                    <label className="font-medium">Ghi chú kỹ thuật (text)</label>
                    <input type="text" value={specs} onChange={(e) => setSpecs(e.target.value)}
                           className="border p-2 w-full rounded"/>
                </div>
            </div>

            <div>
                <label className="font-semibold mb-2 block">📌 Thông số kỹ thuật</label>
                {productSpecs.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                        <input
                            placeholder="Tên thông số"
                            value={s.specName}
                            onChange={(e) => updateSpec(i, 'specName', e.target.value)}
                            className="border p-2 rounded w-1/2"
                        />
                        <input
                            placeholder="Giá trị"
                            value={s.specValue}
                            onChange={(e) => updateSpec(i, 'specValue', e.target.value)}
                            className="border p-2 rounded w-1/2"
                        />
                        <button onClick={() => removeSpec(i)} className="text-red-500 font-bold">🗑</button>
                    </div>
                ))}
                <button onClick={addSpec} className="text-blue-600 underline">+ Thêm thông số</button>
            </div>

            <div>
                <label className="font-semibold mb-2 block">🖼 Hình ảnh</label>
                {images.map((img, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileChange(i, file);
                            }}
                            className="border p-1 rounded"
                        />
                        <label className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                checked={img.isMain}
                                onChange={(e) => updateImage(i, 'isMain', e.target.checked)}
                            />
                            Chính
                        </label>
                        <input
                            type="number"
                            value={img.sortOrder}
                            onChange={(e) => updateImage(i, 'sortOrder', +e.target.value)}
                            className="w-16 border p-2 rounded"
                        />
                        <button onClick={() => removeImage(i)} className="text-red-500 font-bold">🗑</button>
                    </div>
                ))}
                <button onClick={addImage} className="text-blue-600 underline">+ Thêm ảnh</button>
            </div>

            <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
                ✅ Tạo sản phẩm
            </button>
        </div>
    )
}
