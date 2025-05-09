'use client';

import {SearchIcon} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const categories = [
    'cpu',
    'gpu',
    'motherboard',
    'ram',
    'storage',
    'psu',
    'case',
    'cooling',
];

export default function Search() {
    return (
        <form
            action="/search"
            method="GET"
            className="flex items-stretch h-10 w-full max-w-full"
        >
            {/* Category select */}
            <Select name="category">
                <SelectTrigger
                    className="w-auto !h-full dark:border-gray-200 bg-gray-100 text-black border-r  rounded-r-none rounded-l-md">
                    <SelectValue placeholder="All"/>
                </SelectTrigger>
                <SelectContent position="popper">
                    <SelectItem value="all">All</SelectItem>
                    {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                            {category}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            
            <Input
                type="search"
                name="q"
                placeholder="Bạn tìm gì..."
                className="flex-1 rounded-none bg-gray-100 text-black text-base h-full dark:border-gray-300"
            />

            {/* Search button */}
            <button
                type="submit"
                className="bg-primary text-white rounded-r-md rounded-l-none px-3 flex items-center gap-2 h-full"
            >
                <SearchIcon className="w-4 h-4"/>
                <span className="text-sm font-medium hidden sm:inline">Tìm kiếm</span>
            </button>
        </form>
    );
}
