<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Google\Cloud\Storage\StorageClient;

class ProductController extends Controller
{
    // GET /api/products
    public function index()
    {
        // Traer productos con la categoría asociada
        $products = Product::with('category')->get();

        return response()->json($products);
    }

    // POST /api/products
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'required|string|max:255|unique:products,slug',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'price'       => 'required|numeric',
            'stock'       => 'required|integer|min:0',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Manejar la subida de imagen a Firebase Storage
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            
            // Subir a Firebase Storage
            $imageUrl = $this->uploadImageToFirebase($image, $imageName);
            $data['image_url'] = $imageUrl;
        }

        $product = Product::create($data);

        return response()->json($product->load('category'), 201);
    }

    // GET /api/products/{product}
    public function show(Product $product)
    {
        return response()->json($product->load('category'));
    }

    // PUT/PATCH /api/products/{product}
    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'slug'        => 'sometimes|required|string|max:255|unique:products,slug,' . $product->id,
            'description' => 'sometimes|nullable|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'price'       => 'sometimes|required|numeric',
            'stock'       => 'sometimes|required|integer|min:0',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Manejar la subida de nueva imagen a Firebase Storage
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            
            // Subir a Firebase Storage
            $imageUrl = $this->uploadImageToFirebase($image, $imageName);
            $data['image_url'] = $imageUrl;
            
            // Opcional: Eliminar imagen anterior de Firebase si existe
            if ($product->image_url) {
                $this->deleteImageFromFirebase($product->image_url);
            }
        }

        $product->update($data);

        return response()->json($product->load('category'));
    }

    // DELETE /api/products/{product}
    public function destroy(Product $product)
    {
        // Eliminar imagen de Firebase si existe
        if ($product->image_url) {
            $this->deleteImageFromFirebase($product->image_url);
        }
        
        $product->delete();

        return response()->json(null, 204);
    }

    /**
     * Subir imagen a Firebase Storage
     */
    private function uploadImageToFirebase($image, $imageName)
    {
        try {
            // Log para depuración
            \Log::info('Iniciando subida de imagen a Firebase: ' . $imageName);
            
            // Usar las credenciales reales del archivo JSON
            $credentialsPath = storage_path('app/firebase-credentials.json');
            
            // Verificar si el archivo de credenciales existe
            if (!file_exists($credentialsPath)) {
                \Log::error('Archivo de credenciales de Firebase no encontrado en: ' . $credentialsPath);
                throw new \Exception('Archivo de credenciales de Firebase no encontrado');
            }
            
            \Log::info('Credenciales encontradas, inicializando cliente de Storage');
            
            $storage = new StorageClient([
                'keyFilePath' => $credentialsPath,
                'projectId' => 'storage-images-webapp',
                'transport' => [
                    'verify' => false, // Desactivar verificación SSL para desarrollo
                ],
            ]);
            
            $bucket = $storage->bucket('storage-images-webapp.firebasestorage.app');
            
            \Log::info('Bucket obtenido, subiendo archivo: img/' . $imageName);
            
            // Subir archivo a la carpeta /img
            $object = $bucket->upload(
                fopen($image->getPathname(), 'r'),
                [
                    'name' => 'img/' . $imageName,
                    'metadata' => [
                        'contentType' => $image->getMimeType(),
                    ],
                    'predefinedAcl' => 'publicRead'
                ]
            );
            
            \Log::info('Archivo subido exitosamente, generando URL');
            
            // Obtener URL pública usando el formato correcto para gs://
            $imageUrl = 'https://storage.googleapis.com/storage/v0/b/storage-images-webapp.firebasestorage.app/o/img%2F' . rawurlencode($imageName) . '?alt=media';
            
            \Log::info('URL generada: ' . $imageUrl);
            
            return $imageUrl;
            
        } catch (\Exception $e) {
            // Log del error para depuración
            \Log::error('Error al subir imagen a Firebase: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            // En caso de error, devolver una URL placeholder
            return 'https://picsum.photos/300/200?random=' . time();
        }
    }

    /**
     * Eliminar imagen de Firebase Storage
     */
    private function deleteImageFromFirebase($imageUrl)
    {
        try {
            // Extraer el nombre del archivo de la URL
            $fileName = basename($imageUrl);
            
            // Usar las credenciales reales del archivo JSON
            $credentialsPath = storage_path('app/firebase-credentials.json');
            
            if (!file_exists($credentialsPath)) {
                throw new \Exception('Archivo de credenciales de Firebase no encontrado');
            }
            
            $storage = new StorageClient([
                'keyFilePath' => $credentialsPath,
                'projectId' => 'storage-images-webapp',
            ]);
            
            $bucket = $storage->bucket('storage-images-webapp.firebasestorage.app');
            
            // Eliminar archivo de la carpeta /img
            $object = $bucket->object('img/' . $fileName);
            $object->delete();
            
        } catch (\Exception $e) {
            // Log del error para depuración
            \Log::error('Error al eliminar imagen de Firebase: ' . $e->getMessage());
        }
    }
}
