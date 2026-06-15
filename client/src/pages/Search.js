import React from 'react'
import Layout from '../components/Layout/Layout'
import { useSearch } from '../context/search'


const Search = () => {
    const [values, setValues] = useSearch()
    const results = Array.isArray(values?.results) ? values.results : []
    return (
        <Layout title={'Search Results'}>
            <div className="container">
                <div className="text-center">
                    <h1>Search Results</h1>
                    <h6>{results.length < 1 ? 'No products found' : `${results.length} products found`}</h6>
                    <div className="d-flex flex-wrap mt-4">

                        {results.map((p) => (

                            <div key={p._id} className="card m-2" style={{ width: '18rem' }}>
                                <img
                                    src={`/api/v1/product/product-photo/${p._id}?${Date.now()}`}
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
