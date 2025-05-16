// TODO: Refactor this whole mess.

// ! = Required component; ? = Optional component.

import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  DirectionalLight,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TetrahedronGeometry,
  TextureLoader,
  WebGLRenderer,
} from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

const contexts = new Map<string, CanvasContext>();

const hasAnimated = ref(false);

export const primitiveGeometries = {
  box: new BoxGeometry(1, 1, 1),
  icosahedron: new IcosahedronGeometry(),
  triangle: new TetrahedronGeometry(),
  sphere: new SphereGeometry(0.5, 32, 32),
};

export const primitiveTypes = Object.keys(primitiveGeometries);

function getPrimitiveGeometry(type: string) {
  return primitiveGeometries[type as keyof typeof primitiveGeometries];
}

function setupCanvas(canvas: string) {
  document
    .getElementById(canvas)
    ?.appendChild(contexts.get(canvas)!.renderer.domElement);

  if (!hasAnimated.value) {
    animate();

    hasAnimated.value = true;
  }
}

function animate() {
  requestAnimationFrame(animate);

  contexts.forEach((context) => {
    context.renderer.render(context.scene, context.camera);
  });
}

// Create a primitive mesh object
function createPrimitiveMesh(type: string, color: string) {
  const geometry = getPrimitiveGeometry(type);

  return new Mesh(geometry, new MeshBasicMaterial({ color }));
}

// Create a mesh from a loaded model geometry
function createMeshFromGeometry(
  geometry: BufferGeometry | Group | null,
  color: string,
  textureUrl?: string
) {
  if (!geometry) {
    return new Mesh(new BoxGeometry(0, 0, 0), new MeshBasicMaterial({ color }));
  }

  const textureLoader = new TextureLoader();
  let texture = null;

  if (textureUrl) {
    console.log(`Loading texture from: ${textureUrl}`);
    texture = textureLoader.load(
      textureUrl,
      (texture) => {
        console.log("Texture loaded successfully:", texture);
        console.log(
          "Texture dimensions:",
          texture.image.width,
          texture.image.height
        );
      },
      undefined, // onProgress callback (optional)
      (error) => {
        console.error("Error loading texture:", error);
      }
    );
  } else {
    console.log("No texture URL provided, using color only.");
  }

  if (geometry instanceof BufferGeometry) {
    const material = texture
      ? new MeshPhongMaterial({ map: texture, color: 0xffffff }) // Use white color to avoid tinting
      : new MeshBasicMaterial({ color });

    console.log("Material created:", material);
    return new Mesh(geometry, material);
  }

  if (geometry instanceof Group) {
    geometry.traverse((child) => {
      if (child instanceof Mesh) {
        const material = texture
          ? new MeshPhongMaterial({ map: texture, color: 0xffffff }) // Use white color to avoid tinting
          : new MeshBasicMaterial({ color });

        console.log("Material applied to child:", material);
        child.material = material;
      }
    });

    return geometry;
  }

  return new Mesh(new BoxGeometry(0, 0, 0), new MeshBasicMaterial({ color }));
}

// Update the material color of a mesh or group
function updateObjectColor(object: Mesh | Group, color: string) {
  if (object instanceof Mesh) {
    // Preserve texture if it exists
    const material = object.material as MeshBasicMaterial | MeshPhongMaterial;
    material.color.set(color);
    console.log("Updated color for object, material type:", material.type);
  } else if (object instanceof Group) {
    object.traverse((child) => {
      if (child instanceof Mesh) {
        // Preserve texture if it exists
        const material = child.material as
          | MeshBasicMaterial
          | MeshPhongMaterial;
        material.color.set(color);
        console.log(
          "Updated color for child in group, material type:",
          material.type
        );
      }
    });
  }
}

async function addObjectToScene(context: CanvasContext, node: Tree, mesh: any) {
  const isPrimitive = primitiveTypes.includes(mesh.type);

  isPrimitive
    ? console.log("Switching to primitive:", mesh.type)
    : console.log("Switching to custom model:", mesh.type);

  // Get texture URL if texture is selected
  let textureUrl: string | undefined = undefined;
  if (mesh.texture && mesh.texture !== "default") {
    console.log("Looking for texture:", mesh.texture);
    const assetsStore = useAssetsStore();
    const selectedTexture = assetsStore.images.find(
      (img: { name: string; url: URL }) => img.name === mesh.texture
    );
    if (selectedTexture) {
      textureUrl = selectedTexture.url.toString();
      console.log("Found texture URL:", textureUrl);
    } else {
      console.warn("Texture not found:", mesh.texture);
    }
  } else {
    console.log("No texture selected or using default");
  }

  const newObject = isPrimitive
    ? createPrimitiveMesh(mesh.type, mesh.colour)
    : await loadModel(context, mesh.type, mesh.fallback).then((geometry) =>
        createMeshFromGeometry(geometry ?? null, mesh.colour, textureUrl)
      );

  newObject.position.set(mesh.x, mesh.y, mesh.z);
  newObject.scale.set(mesh.scale, mesh.scale, mesh.scale);

  context.objects.set(node.id, newObject);
  context.scene.add(newObject);
}

export function useElementRenderer() {
  const { currentComponents } = storeToRefs(useDeckStore());

  function findComponent(node: Tree, type: ComponentType) {
    return currentComponents.value.find(
      (component) => component.type === type && component.node === node.id
    );
  }

  const renderEl = ref<HTMLDivElement>(
    document.querySelector(".render") as HTMLDivElement
  );

  onMounted(() => {
    renderEl.value = document.querySelector(".render") as HTMLDivElement;
  });

  const { width, height } = useElementSize(renderEl);

  const scale = computed(() => {
    return Math.min(width.value / 1920, height.value / 1080);
  });

  const renderer: Record<NodeType, ElementRenderer> = {
    group: {
      element: "div",
      render: (node: Tree) => {
        const layout = findComponent(node, "layout")?.data || {};

        return {
          style: {
            margin: `${layout.margin}px`,
            display: "flex",
            alignItems: layout.align,
            justifyContent: layout.justify,
          },
        };
      },
    },
    text: {
      element: "p",
      render: (node: Tree) => {
        const typography = findComponent(node, "typography")!.data;
        const transform = findComponent(node, "transform")!.data;

        const xPercent = (transform.x / 1920) * 100;
        const yPercent = (transform.y / 1080) * 100;

        return {
          content: typography.content,
          style: {
            top: `${yPercent}%`,
            left: `${xPercent}%`,
            zIndex: transform.z,
            transform: `scale(${transform.scale * scale.value})`,
            fontFamily: typography.font,
            fontSize: `${typography.size}px`,
            fontWeight: typography.weight,
            color: typography.colour,
          },
        };
      },
    },
    webgl_canvas: {
      element: "div",
      render: (node: Tree) => {
        const transform = findComponent(node, "transform")!.data;

        const sceneComponent = findComponent(node, "scene")!.data;
        const cameraComponent = findComponent(node, "camera")!.data;

        const xPercent = (transform.x / 1920) * 100;
        const yPercent = (transform.y / 1080) * 100;

        watch(
          () => transform.width / transform.height,
          (newAspectRatio) => {
            const context = contexts.get(node.id);

            if (!context) return;

            context.camera.aspect = newAspectRatio;
            context.camera.updateProjectionMatrix();

            context.renderer.setSize(transform.width, transform.height);
          }
        );

        if (!contexts.has(node.id)) {
          contexts.set(node.id, {
            scene: new Scene(),
            camera: new PerspectiveCamera(
              75,
              transform.width / transform.height,
              0.1,
              1000
            ),
            renderer: new WebGLRenderer({ antialias: true }),
            loaders: {
              fbx: new FBXLoader(),
              gltf: new GLTFLoader(),
              obj: new OBJLoader(),
            },
            objects: new Map(),
            cache: new Map(),
          });

          const ambientLight = new AmbientLight(0xffffff, 0.5);
          const directionalLight = new DirectionalLight(0xffffff, 1);

          directionalLight.position.set(5, 5, 5);

          contexts.get(node.id)!.scene.add(ambientLight);
          contexts.get(node.id)!.scene.add(directionalLight);
        }

        const context = contexts.get(node.id);

        context?.renderer.setSize(transform.width, transform.height);
        context?.renderer.setClearColor(sceneComponent.background);

        context?.camera.position.set(
          cameraComponent.x,
          cameraComponent.y,
          cameraComponent.z
        );

        return {
          style: {
            top: `${yPercent}%`,
            left: `${xPercent}%`,
            zIndex: transform.z,
            width: `${transform.width}px`,
            height: `${transform.height}px`,
            transform: `scale(${transform.scale * scale.value})`,
          },
        };
      },
    },
    webgl_object: {
      element: "",
      render: (node: Tree) => {
        const context = contexts.get(node.parent!.id);

        if (!context) return {};

        const mesh = findComponent(node, "mesh")!.data;

        console.log("adding object", mesh.type);

        const isPrimitive = primitiveTypes.includes(mesh.type);
        const existingObject = context.objects.get(node.id);

        if (!existingObject) {
          addObjectToScene(context, node, mesh);

          return {};
        }

        console.log("Existing object:", existingObject);

        // Check if texture has changed
        let textureChanged = false;
        let textureUrl: string | undefined = undefined;

        if (mesh.texture && mesh.texture !== "default") {
          console.log("Looking for texture update:", mesh.texture);
          const assetsStore = useAssetsStore();
          const selectedTexture = assetsStore.images.find(
            (img: { name: string; url: URL }) => img.name === mesh.texture
          );

          if (selectedTexture) {
            textureUrl = selectedTexture.url.toString();
            console.log("Found texture URL for update:", textureUrl);

            // Check if the material has a texture map
            if (existingObject instanceof Mesh) {
              const material = existingObject.material as
                | MeshBasicMaterial
                | MeshPhongMaterial;
              textureChanged =
                !material.map || material.map.source.data.src !== textureUrl;
            } else if (existingObject instanceof Group) {
              // Check first mesh in group
              let firstMeshFound = false;
              existingObject.traverse((child) => {
                if (!firstMeshFound && child instanceof Mesh) {
                  const material = child.material as
                    | MeshBasicMaterial
                    | MeshPhongMaterial;
                  textureChanged =
                    !material.map ||
                    material.map.source.data.src !== textureUrl;
                  firstMeshFound = true;
                }
              });
            }
          }
        }

        const isPrimitiveChanged =
          existingObject instanceof Mesh &&
          existingObject.geometry.type.toLowerCase() !==
            mesh.type.toLowerCase();

        const isCustomModelChanged =
          existingObject instanceof Group && !isPrimitive;

        // If type or texture changed significantly, recreate the object
        if (isPrimitiveChanged || isCustomModelChanged || textureChanged) {
          console.log("Type or texture changed, recreating object");

          if (existingObject instanceof Mesh) {
            existingObject.geometry.dispose();

            Array.isArray(existingObject.material)
              ? existingObject.material.forEach((material) =>
                  material.dispose()
                )
              : existingObject.material.dispose();
          }

          context.scene.remove(existingObject);

          addObjectToScene(context, node, mesh);

          return {};
        }

        updateObjectColor(existingObject, mesh.colour);

        existingObject.position.set(mesh.x, mesh.y, mesh.z);
        existingObject.scale.set(mesh.scale, mesh.scale, mesh.scale);

        return {};
      },
    },
  };

  return {
    renderer,
    setupCanvas,
  };
}
