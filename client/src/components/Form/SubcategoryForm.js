import React from 'react'

const SubcategoryForm = ({ handleSubmit, name, setName, parentCategory, setParentCategory, categories }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <select
                    className="form-select"
                    value={parentCategory}
                    onChange={(e) => setParentCategory(e.target.value)}
                >
                    <option value="">Select parent category</option>
                    {categories?.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter new subcategory"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
}

export default SubcategoryForm
