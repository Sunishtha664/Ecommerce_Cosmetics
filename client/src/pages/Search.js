import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useSearch } from '../context/search'
import axios from 'axios'
import { Checkbox, Radio } from 'antd'
import { Prices } from '../components/Routes/Prices'


const Search = () => {
    const [values] = useSearch()
    const results = Array.isArray(values?.results) ? values.results : []
    const API = process.env.REACT_APP_API || ''
    const [categories, setCategories] = useState([])
    const [checked, setChecked] = useState([])
    const [radio, setRadio] = useState([])
    const [filteredResults, setFilteredResults] = useState([])

    useEffect(() => {
        setFilteredResults(results)
    }, [results])

    useEffect(() => {
        getAllCategories()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [checked, radio, results])

    const getAllCategories = async () => {
        try {
            const res = await axios.get('/api/v1/category/get-category')
            if (res.data?.success) {
                setCategories(res.data?.category || [])
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleFilter = (value, id) => {
        let all = [...checked]
        if (value) {
            all.push(id)
        }
        else {
            all = all.filter((c) => c !== id)
        }
        setChecked(all)
    }

    const applyFilters = () => {
        let tempResults = [...results]

        if (checked.length) {
            tempResults = tempResults.filter((product) => {
                const productCategory = typeof product.category === 'object' ? product.category?._id : product.category
                return checked.includes(productCategory)
            })
        }

        if (radio.length) {
            tempResults = tempResults.filter((product) => product.price >= radio[0] && product.price <= radio[1])
        }

        setFilteredResults(tempResults)
    }

    const resetFilters = () => {
        setChecked([])
        setRadio([])
        setFilteredResults(results)
    }

    return (
        <Layout title={'Search Results'}>
            <div className="row mt-3">
                <div className="col-md-3">
                    <h4 className="text-center">Filter By Category</h4>
                    <div className="d-flex flex-column">
                        {categories?.map((c) => (
                            <div key={c._id}>
                                <Checkbox onChange={(e) => handleFilter(e.target.checked, c._id)}>{c.name}</Checkbox>
                            </div>
                        ))}
                    </div>

                    <h4 className="text-center mt-4">Filter By Price</h4>
                    <div className="d-flex flex-column">
                        <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                            {Prices?.map((p) => (
                                <div key={p._id}>
                                    <Radio value={p.array}>{p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>

                    <div className="d-flex flex-column mt-3">
                        <button className="btn btn-danger" onClick={resetFilters}>Reset Filters</button>
                    </div>
                </div>
                <div className="col-md-9 text-center">
                    <h1>Search Results</h1>
                    <h6>{filteredResults.length < 1 ? 'No products found' : `${filteredResults.length} products found`}</h6>
                    <div className="d-flex flex-wrap mt-4">

                        {filteredResults.map((p) => (

                            <div key={p._id} className="card m-2" style={{ width: '18rem' }}>
                                <img
                                    src={`${API}/api/v1/product/product-photo/${p._id}?${Date.now()}`}
                                    className="card-img-top"
                                    alt={p.name}
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/286x180?text=No+Image' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description?.substring(0, 30)}...</p>
                                    <p className="card-text">Price: रु{p.price}</p>
                                    <button className="btn btn-primary ms-1 width-100">More Details</button>
                                    <button className="btn btn-secondary ms-1">ADD TO CART</button>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            </div>

        </Layout>
    )
}

export default Search
