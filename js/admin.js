// ==========================
// API & GLOBAL VARIABLES
// ==========================
const BASE_URL = "https://6a1efb5cb79eec0d6cf061d6.mockapi.io/api/Product";
let productList = [];
let isEditing = false;
let isSortAsc = true;

// ==========================
// DOM ELEMENTS
// ==========================
const tblProductList = document.getElementById("tblProductList");
const searchInput = document.getElementById("searchInput");
const btnSortPrice = document.getElementById("btnSortPrice");

// Modal Elements
const productModal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");
const btnSaveModal = document.getElementById("btnSaveModal");

// Form Elements
const prodIdInput = document.getElementById("prodId");
const prodNameInput = document.getElementById("prodName");
const prodPriceInput = document.getElementById("prodPrice");
const prodTypeInput = document.getElementById("prodType");
const prodScreenInput = document.getElementById("prodScreen");
const prodImgInput = document.getElementById("prodImg");
const prodFrontCameraInput = document.getElementById("prodFrontCamera");
const prodBackCameraInput = document.getElementById("prodBackCamera");
const prodDescInput = document.getElementById("prodDesc");

// Toast
const toast = document.getElementById("toast-success");
const toastMessage = document.getElementById("toastMessage");

// ==========================
// INITIALIZATION
// ==========================
function init() {
    fetchProducts();
}

// ==========================
// FETCH & RENDER
// ==========================
async function fetchProducts() {
    try {
        const response = await axios.get(BASE_URL);
        productList = response.data;
        renderProducts(productList);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

function renderProducts(products) {
    let html = "";
    products.forEach((product) => {
        html += `
        <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">${product.id}</td>
            <td class="px-6 py-4">
                <img src="${product.img || product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded">
            </td>
            <td class="px-6 py-4 font-semibold text-gray-900">${product.name}</td>
            <td class="px-6 py-4 text-red-600 font-bold">$${product.price}</td>
            <td class="px-6 py-4">
                <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-400">
                    ${product.type}
                </span>
            </td>
            <td class="px-6 py-4 text-center">
                <button onclick="editProduct('${product.id}')" class="font-medium text-blue-600 hover:underline mr-3" title="Sửa">
                    <i class="fa-solid fa-pen-to-square text-lg"></i>
                </button>
                <button onclick="deleteProduct('${product.id}')" class="font-medium text-red-600 hover:underline" title="Xóa">
                    <i class="fa-solid fa-trash text-lg"></i>
                </button>
            </td>
        </tr>
        `;
    });
    tblProductList.innerHTML = html;
}

// ==========================
// MODAL & FORM HANDLING
// ==========================
function openAddModal() {
    isEditing = false;
    modalTitle.innerHTML = "Thêm sản phẩm mới";
    resetForm();
    clearValidation();
}

function closeModal() {
    // Flowbite's data-modal-toggle should handle closing, but we can programmatically close if needed.
    // In this simple setup with Flowbite 2.2+, clicking the close button will just use the DOM.
    // Since we used data-modal-toggle, we trigger a click on a hidden button or just hide the modal class.
    const modalInstance = FlowbiteInstances.getInstance('Modal', 'productModal');
    if (modalInstance) {
        modalInstance.hide();
    } else {
        // Fallback if not initialized via JS
        productModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}

function resetForm() {
    prodIdInput.value = "";
    prodNameInput.value = "";
    prodPriceInput.value = "";
    prodTypeInput.value = "";
    prodScreenInput.value = "";
    prodImgInput.value = "";
    prodFrontCameraInput.value = "";
    prodBackCameraInput.value = "";
    prodDescInput.value = "";
}

// ==========================
// VALIDATION
// ==========================
function showErr(elementId, show) {
    const el = document.getElementById(elementId);
    if (show) {
        el.classList.remove("hidden");
    } else {
        el.classList.add("hidden");
    }
}

function clearValidation() {
    showErr("errName", false);
    showErr("errPrice", false);
    showErr("errType", false);
    showErr("errScreen", false);
    showErr("errImg", false);
    showErr("errFrontCamera", false);
    showErr("errBackCamera", false);
    showErr("errDesc", false);
}

function validateForm() {
    let isValid = true;
    clearValidation();

    if (!prodNameInput.value.trim()) { showErr("errName", true); isValid = false; }
    if (!prodPriceInput.value || Number(prodPriceInput.value) <= 0) { showErr("errPrice", true); isValid = false; }
    if (!prodTypeInput.value) { showErr("errType", true); isValid = false; }
    if (!prodScreenInput.value.trim()) { showErr("errScreen", true); isValid = false; }
    if (!prodImgInput.value.trim()) { showErr("errImg", true); isValid = false; }
    if (!prodFrontCameraInput.value.trim()) { showErr("errFrontCamera", true); isValid = false; }
    if (!prodBackCameraInput.value.trim()) { showErr("errBackCamera", true); isValid = false; }
    if (!prodDescInput.value.trim()) { showErr("errDesc", true); isValid = false; }

    return isValid;
}

// ==========================
// CREATE & UPDATE (SAVE)
// ==========================
btnSaveModal.addEventListener("click", async () => {
    if (!validateForm()) return;

    const productData = {
        name: prodNameInput.value.trim(),
        price: Number(prodPriceInput.value),
        type: prodTypeInput.value,
        screen: prodScreenInput.value.trim(),
        img: prodImgInput.value.trim(), // API might use image or img, using img
        frontCamera: prodFrontCameraInput.value.trim(),
        backCamera: prodBackCameraInput.value.trim(),
        description: prodDescInput.value.trim(),
    };

    try {
        if (isEditing) {
            const id = prodIdInput.value;
            await axios.put(`${BASE_URL}/${id}`, productData);
            showToast("Cập nhật sản phẩm thành công!");
        } else {
            await axios.post(BASE_URL, productData);
            showToast("Thêm sản phẩm thành công!");
        }
        
        closeModal();
        fetchProducts();
    } catch (error) {
        console.error("Error saving product:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
});

// ==========================
// EDIT
// ==========================
window.editProduct = async function(id) {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        const p = response.data;

        isEditing = true;
        modalTitle.innerHTML = "Chỉnh sửa sản phẩm";
        clearValidation();
        
        prodIdInput.value = p.id;
        prodNameInput.value = p.name;
        prodPriceInput.value = p.price;
        prodTypeInput.value = p.type;
        prodScreenInput.value = p.screen;
        prodImgInput.value = p.img || p.image;
        prodFrontCameraInput.value = p.frontCamera;
        prodBackCameraInput.value = p.backCamera;
        prodDescInput.value = p.description;

        // Show modal manually if not triggered by data-toggle
        const modalInstance = FlowbiteInstances.getInstance('Modal', 'productModal');
        if (modalInstance) {
            modalInstance.show();
        } else {
            productModal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        }

    } catch (error) {
        console.error("Error fetching product for edit:", error);
    }
};

// ==========================
// DELETE
// ==========================
window.deleteProduct = async function(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
        await axios.delete(`${BASE_URL}/${id}`);
        showToast("Đã xóa sản phẩm!");
        fetchProducts();
    } catch (error) {
        console.error("Error deleting product:", error);
        alert("Có lỗi xảy ra khi xóa!");
    }
};

// ==========================
// SEARCH & FILTER
// ==========================
searchInput.addEventListener("input", function() {
    const keyword = this.value.toLowerCase().trim();
    
    if (!keyword) {
        renderProducts(productList);
        return;
    }

    const filtered = productList.filter((p) => p.name.toLowerCase().includes(keyword));
    renderProducts(filtered);
});

// ==========================
// SORT BY PRICE
// ==========================
btnSortPrice.addEventListener("click", () => {
    isSortAsc = !isSortAsc; // toggle
    
    let currentData = [...productList];
    
    // Support searching + sorting at the same time
    const keyword = searchInput.value.toLowerCase().trim();
    if (keyword) {
        currentData = currentData.filter((p) => p.name.toLowerCase().includes(keyword));
    }

    currentData.sort((a, b) => {
        if (isSortAsc) {
            return a.price - b.price;
        } else {
            return b.price - a.price;
        }
    });
    
    // Update button icon
    if (isSortAsc) {
        btnSortPrice.innerHTML = `<i class="fa-solid fa-sort-up mr-2"></i> Giá: Tăng dần`;
    } else {
        btnSortPrice.innerHTML = `<i class="fa-solid fa-sort-down mr-2"></i> Giá: Giảm dần`;
    }

    renderProducts(currentData);
});

// ==========================
// TOAST NOTIFICATION
// ==========================
function showToast(message) {
    toastMessage.innerHTML = message;
    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);
}

// Run app
init();
