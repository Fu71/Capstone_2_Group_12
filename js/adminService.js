// js/adminService.js

const BASE_URL = "https://6a1efb5cb79eec0d6cf061d6.mockapi.io/api/Product";

const adminService = {
    /** Lấy danh sách sản phẩm */
    getProducts: function () {
        return axios.get(BASE_URL)
            .then(function (res) {
                return res.data;
            })
            .catch(function (err) {
                console.error("Lỗi lấy danh sách:", err);
                return [];
            });
    },

    /** Lấy 1 sản phẩm theo ID */
    getProductById: function (id) {
        return axios.get(`${BASE_URL}/${id}`)
            .then(function (res) {
                return res.data;
            });
    },

    /** Thêm sản phẩm mới */
    addProduct: function (productData) {
        return axios.post(BASE_URL, productData)
            .then(function (res) {
                return res.data;
            });
    },

    /** Cập nhật sản phẩm */
    updateProduct: function (id, productData) {
        return axios.put(`${BASE_URL}/${id}`, productData)
            .then(function (res) {
                return res.data;
            });
    },

    /** Xóa sản phẩm */
    deleteProduct: function (id) {
        return axios.delete(`${BASE_URL}/${id}`)
            .then(function (res) {
                return res.data;
            });
    }
};
