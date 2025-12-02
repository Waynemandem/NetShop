document.addEventListener('DOMContentLoaded', async () => {
  // Ensure ImageDB is loaded
  if (!window.ImageDB) {
    console.error('ImageDB not loaded! Make sure db.js is included before seller.js');
    return;
  }

  const form = document.getElementById('seller-form');
  const feedback = document.getElementById('seller-feedback');
  const clearBtn = document.getElementById('seller-clear');

  // Initialize IndexedDB
  try {
    await ImageDB.init();
  } catch (err) {
    console.error('Failed to initialize IndexedDB:', err);
    showMessage('Could not initialize storage. Some features may not work.', 'error');
  }

  const safeParse = (k, fallback = null) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  };
  const safeSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.warn('safeSet', e); } };

  const slug = (s) => String(s || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

  function showMessage(msg, type = 'success') {
    if (typeof showToast === 'function') { showToast(msg, type); return; }
    if (feedback) {
      feedback.textContent = msg;
      feedback.className = `seller-feedback ${type}`;
      setTimeout(() => { feedback.textContent = ''; feedback.className = ''; }, 3000);
    } else {
      alert(msg);
    }
  }

  if (clearBtn) clearBtn.addEventListener('click', () => { form.reset(); document.getElementById('product-image-preview').style.display = 'none'; });

  // preview selected image
  const fileInput = document.getElementById('product-image');
  const previewImg = document.getElementById('product-image-preview');
  const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2MB

  fileInput?.addEventListener('change', (ev) => {
    const f = fileInput.files && fileInput.files[0];
    if (!f) {
      if (previewImg) previewImg.style.display = 'none';
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      showMessage('Selected image is larger than 2 MB. Please choose a smaller file.', 'error');
      fileInput.value = '';
      if (previewImg) previewImg.style.display = 'none';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (previewImg) {
        previewImg.src = reader.result;
        previewImg.style.display = 'block';
      }
    };
    reader.onerror = () => {
      showMessage('Could not read image file.', 'error');
      fileInput.value = '';
      if (previewImg) previewImg.style.display = 'none';
    };
    reader.readAsDataURL(f);
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('product-name')?.value?.trim();
    const brand = document.getElementById('product-brand')?.value?.trim();
    const category = document.getElementById('product-category')?.value || 'uncategorized';
    const priceRaw = document.getElementById('product-price')?.value;
    // read file input as data URL if present
    let image = '';
    const fileEl = document.getElementById('product-image');
    const file = fileEl?.files ? fileEl.files[0] : null;
    // helper to read file -> dataURL
    const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });

    if (file) {
      if (file.size > MAX_FILE_BYTES) { showMessage('Image too large (max 2 MB).', 'error'); return; }
      try {
        image = await readFileAsDataURL(file);
      } catch (err) {
        console.warn('read image failed', err);
        showMessage('Could not read image file.', 'error');
        return;
      }
    }
    const description = document.getElementById('product-description')?.value?.trim() || '';

    if (!name) { showMessage('Please enter a product name', 'error'); return; }

    // normalize price input: remove non-numeric characters (except dot and minus) then parse
    let price = null;
    if (priceRaw) {
      const cleaned = String(priceRaw).replace(/[^0-9.\-]/g, '');
      const parsed = parseFloat(cleaned);
      price = Number.isFinite(parsed) ? parsed : null;
    }

    const shopProducts = safeParse('shopProducts', []);

    const productId = slug(name);
    const product = {
      id: productId,
      name,
      brandName: brand || '',
      category,
      price: price != null ? price : '',
      description,
      hasImage: !!image // Flag to indicate if product has an image
    };

    // avoid duplicate id
    const exists = shopProducts.find(p => p.id === product.id || p.name === product.name);
    if (exists) {
      showMessage('A product with that name already exists. Consider changing the name.', 'error');
      return;
    }

    try {
      if (image) {
        // Store image in IndexedDB first
        await ImageDB.saveImage(productId, image);
      }

      // Save product to IndexedDB via global helper
      if (window.saveProduct) {
        await window.saveProduct(product);
      } else {
        // Fallback to localStorage if something is wrong
        shopProducts.push(product);
        safeSet('shopProducts', shopProducts);
      }

      // For selectedProduct, include the image for immediate use
      const selectedProduct = { ...product };
      if (image) {
        selectedProduct.image = image; // Include image for preview
      }
      safeSet('selectedProduct', selectedProduct);

      showMessage('Product added successfully — redirecting to shop...', 'success');

      setTimeout(() => { window.location.href = 'shop.html'; }, 700);
    } catch (err) {
      console.error('Failed to save product:', err);
      showMessage('Failed to save product. Please try again.', 'error');
    }
  });
});
