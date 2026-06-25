import React from 'react'

const SectionForm = ({ handleSubmit, name, setName, category, setCategory, parentSubcategory, setParentSubcategory, categories, subcategories }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Select category</option>
                    {categories?.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <select
                    className="form-select"
                    value={parentSubcategory}
                    onChange={(e) => setParentSubcategory(e.target.value)}
                    disabled={!category}
                >
                    <option value="">Select parent subcategory</option>
                    {subcategories?.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                            {sub.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter new section"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
}

export default SectionForm