interface Props {
    specs: { specName: string; specValue: string }[];
}

export default function ProductSpecs({specs}: Props) {
    if (specs.length === 0) return null;

    return (
        <div className="mt-10 bg-white rounded p-4 shadow">
            <h2 className="text-lg font-semibold mb-4">Thông số kỹ thuật</h2>
            <table className="w-full text-sm text-left text-gray-700">
                <tbody>
                {specs.map((spec, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                        <th className="py-2 px-4 w-1/3 font-medium text-gray-900">{spec.specName}</th>
                        <td className="py-2 px-4">{spec.specValue}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
