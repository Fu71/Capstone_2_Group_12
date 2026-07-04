// js/admin.js

// ==========================
// GLOBAL STATE
// ==========================
let productList = [];
let isEditing = false;
let isSortAsc = true;

// ==========================
// LẤY ELEMENT (DOM)
// ==========================
const DOM = {
    tblList: document.getElementById("tblProductList"),
    searchInput: document.getElementById("searchInput"),
    btnSortPrice: document.getElementById("btnSortPrice"),
    btnSave: document.getElementById("btnSaveModal"),
    modalTitle: document.getElementById("modalTitle"),
    modalEl: document.getElementById("productModal"),
    toast: document.getElementById("toast-success"),
    toastMsg: document.getElementById("toastMessage")
};

// Cấu hình form input và id thông báo lỗi tương ứng
const FORM_FIELDS = [
    { id: "prodName", err: "errName", type: "string" },
    { id: "prodPrice", err: "errPrice", type: "number" },
    { id: "prodType", err: "errType", type: "string" },
    { id: "prodScreen", err: "errScreen", type: "string" },
    { id: "prodImg", err: "errImg", type: "string" },
    { id: "prodFrontCamera", err: "errFrontCamera", type: "string" },
    { id: "prodBackCamera", err: "errBackCamera", type: "string" },
    { id: "prodDesc", err: "errDesc", type: "string" }
];

// ==========================
// KHỞI TẠO APP
// ==========================
function init() {
    fetchAndRender();
}

function fetchAndRender() {
    adminService.getProducts().then(function (data) {
        productList = data;
        renderProducts(productList);
    });
}

// ==========================
// RENDER GIAO DIỆN
// ==========================
function renderProducts(dataArr) {
    let html = "";
    dataArr.forEach(function (p) {
        html += `
        <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-medium text-gray-900">${p.id}</td>
            <td class="px-6 py-4"><img src="${p.img || p.image}" alt="${p.name}" class="w-16 h-16 object-cover rounded"></td>
            <td class="px-6 py-4 font-semibold text-gray-900">${p.name}</td>
            <td class="px-6 py-4 text-red-600 font-bold">$${p.price}</td>
            <td class="px-6 py-4">
                <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-400">${p.type}</span>
            </td>
            <td class="px-6 py-4 text-center">
                <button onclick="handleEdit('${p.id}')" class="text-blue-600 hover:underline mr-3"><i class="fa-solid fa-pen-to-square text-lg"></i></button>
                <button onclick="handleDelete('${p.id}')" class="text-red-600 hover:underline"><i class="fa-solid fa-trash text-lg"></i></button>
            </td>
        </tr>
        `;
    });
    DOM.tblList.innerHTML = html;
}

// ==========================
// QUẢN LÝ FORM & MODAL
// ==========================
window.openAddModal = function () {
    isEditing = false;
    DOM.modalTitle.innerText = "Thêm sản phẩm mới";
    document.getElementById("prodId").value = "";
    
    FORM_FIELDS.forEach(function (f) {
        document.getElementById(f.id).value = "";
        document.getElementById(f.err).classList.add("hidden");
    });
};

window.closeModal = function () {
    const instance = FlowbiteInstances.getInstance('Modal', 'productModal');
    if (instance) {
        instance.hide();
    } else {
        DOM.modalEl.classList.add('hidden');
    }
};

function getFormData() {
    return {
        name: document.getElementById("prodName").value.trim(),
        price: Number(document.getElementById("prodPrice").value),
        type: document.getElementById("prodType").value,
        screen: document.getElementById("prodScreen").value.trim(),
        img: document.getElementById("prodImg").value.trim(),
        frontCamera: document.getElementById("prodFrontCamera").value.trim(),
        backCamera: document.getElementById("prodBackCamera").value.trim(),
        description: document.getElementById("prodDesc").value.trim()
    };
}

// ==========================
// VALIDATION (Rút gọn)
// ==========================
function validateForm() {
    let isValid = true;
    FORM_FIELDS.forEach(function (field) {
        const val = document.getElementById(field.id).value.trim();
        const errEl = document.getElementById(field.err);
        
        let hasError = false;
        if (val === "") {
            hasError = true;
        }
        if (field.type === "number" && (isNaN(val) || Number(val) <= 0)) {
            hasError = true;
        }

        if (hasError) {
            errEl.classList.remove("hidden");
            isValid = false;
        } else {
            errEl.classList.add("hidden");
        }
    });
    return isValid;
}

// ==========================
// CÁC HÀM XỬ LÝ (CRUD)
// ==========================
DOM.btnSave.addEventListener("click", function () {
    if (!validateForm()) return;
    
    const data = getFormData();
    
    if (isEditing) {
        const id = document.getElementById("prodId").value;
        adminService.updateProduct(id, data)
            .then(function () {
                showToast("Đã cập nhật thành công!");
                closeModal();
                fetchAndRender();
            })
            .catch(function () {
                alert("Có lỗi xảy ra khi cập nhật!");
            });
    } else {
        adminService.addProduct(data)
            .then(function () {
                showToast("Đã thêm thành công!");
                closeModal();
                fetchAndRender();
            })
            .catch(function () {
                alert("Có lỗi xảy ra khi thêm mới!");
            });
    }
});

window.handleEdit = function (id) {
    adminService.getProductById(id)
        .then(function (p) {
            isEditing = true;
            DOM.modalTitle.innerText = "Chỉnh sửa sản phẩm";
            
            // Đổ data lên form
            document.getElementById("prodId").value = p.id;
            document.getElementById("prodName").value = p.name;
            document.getElementById("prodPrice").value = p.price;
            document.getElementById("prodType").value = p.type;
            document.getElementById("prodScreen").value = p.screen;
            document.getElementById("prodImg").value = p.img || p.image;
            document.getElementById("prodFrontCamera").value = p.frontCamera;
            document.getElementById("prodBackCamera").value = p.backCamera;
            document.getElementById("prodDesc").value = p.description;

            FORM_FIELDS.forEach(function (f) {
                document.getElementById(f.err).classList.add("hidden");
            });

            const instance = FlowbiteInstances.getInstance('Modal', 'productModal');
            if (instance) {
                instance.show();
            } else {
                DOM.modalEl.classList.remove('hidden');
            }
        })
        .catch(function (err) {
            console.error(err);
        });
};

window.handleDelete = function (id) {
    if (!confirm("Bạn có chắc chắn muốn xóa?")) return;
    
    adminService.deleteProduct(id)
        .then(function () {
            showToast("Đã xóa sản phẩm!");
            fetchAndRender();
        })
        .catch(function () {
            alert("Xóa thất bại!");
        });
};

// ==========================
// TÌM KIẾM & SẮP XẾP
// ==========================
DOM.searchInput.addEventListener("input", function (e) {
    const keyword = e.target.value.toLowerCase().trim();
    const filtered = productList.filter(function (p) {
        return p.name.toLowerCase().includes(keyword);
    });
    renderProducts(filtered);
});

DOM.btnSortPrice.addEventListener("click", function () {
    isSortAsc = !isSortAsc;
    let filtered = [...productList];
    
    // Kết hợp tìm kiếm
    const keyword = DOM.searchInput.value.toLowerCase().trim();
    if (keyword) {
        filtered = filtered.filter(function (p) {
            return p.name.toLowerCase().includes(keyword);
        });
    }

    filtered.sort(function (a, b) {
        if (isSortAsc) {
            return a.price - b.price;
        } else {
            return b.price - a.price;
        }
    });
    
    if (isSortAsc) {
        DOM.btnSortPrice.innerHTML = `<i class="fa-solid fa-sort-up mr-2"></i> Giá: Tăng dần`;
    } else {
        DOM.btnSortPrice.innerHTML = `<i class="fa-solid fa-sort-down mr-2"></i> Giá: Giảm dần`;
    }
        
    renderProducts(filtered);
});

// ==========================
// UTILS (TOAST)
// ==========================
function showToast(msg) {
    DOM.toastMsg.innerText = msg;
    DOM.toast.classList.remove("hidden");
    setTimeout(function () {
        DOM.toast.classList.add("hidden");
    }, 3000);
}

// Chạy ứng dụng
init();
