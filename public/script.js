let nextCursor = null;

async function loadProducts() {

    const category =
        document.getElementById("category").value;

    let url = "/products";

    const params = [];

    if (category) {
        params.push(`category=${category}`);
    }

    if (nextCursor) {

        params.push(
            `cursorUpdatedAt=${encodeURIComponent(
                nextCursor.cursorUpdatedAt
            )}`
        );

        params.push(
            `cursorId=${nextCursor.cursorId}`
        );
    }

    if (params.length > 0) {
        url += "?" + params.join("&");
    }

    const response = await fetch(url);

    const data = await response.json();

    const container =
        document.getElementById("products");

    data.products.forEach(product => {

        container.innerHTML += `
        <div class="card">

            <div class="category">
                ${product.category}
            </div>

            <h3>${product.name}</h3>

            <p>
                Product ID: ${product.id}
            </p>

            <div class="price">
                ₹${product.price}
            </div>

        </div>
        `;
    });

    nextCursor = data.nextCursor;
}

function applyFilter() {

    nextCursor = null;

    document.getElementById("products").innerHTML = "";

    loadProducts();
}

document
    .getElementById("nextBtn")
    .addEventListener("click", loadProducts);

loadProducts();