// TODO: Refactor this whole mess.

// ! = Required component; ? = Optional component.

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  SphereGeometry,
  IcosahedronGeometry,
  TetrahedronGeometry,
  MeshBasicMaterial,
  Mesh,
  BufferGeometry,
  Group,
} from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

interface CanvasContext {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  loaders: {
    fbx: FBXLoader;
    gltf: GLTFLoader;
    obj: OBJLoader;
  };
  objects: Map<string, Mesh | Group>;
  cache: Map<string, BufferGeometry | Group>;
}

const contexts = new Map<string, CanvasContext>();

const hasAnimated = ref(false);

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
    context.scene.children.forEach((child) => {
      child.rotation.x += 0.01;
      child.rotation.y += 0.01;
    });

    context.renderer.render(context.scene, context.camera);
  });
}

async function loadMesh(
  context: CanvasContext,
  name: string
): Promise<BufferGeometry | Group> {
  const { meshes } = storeToRefs(useAssetsStore());

  if (context.cache.has(name)) {
    return context.cache.get(name)!;
  }

  const mesh = meshes.value.find((asset) => asset.name === name);

  if (!mesh) {
    console.error(`Model ${name} not found in assets`);
    return new BoxGeometry(0, 0, 0);
  }

  const extension = name.split(".").pop()?.toLowerCase();
  const url = mesh.url.toString();

  try {
    let result: BufferGeometry | Group;

    switch (extension) {
      case "glb":
      case "gltf":
        result = await new Promise((resolve, reject) => {
          context.loaders.gltf.load(
            url,
            (gltf) => resolve(gltf.scene),
            undefined,
            reject
          );
        });
        break;

      case "fbx":
        result = await new Promise((resolve, reject) => {
          context.loaders.fbx.load(url, resolve, undefined, reject);
        });
        break;

      case "obj":
        result = await new Promise((resolve, reject) => {
          context.loaders.obj.load(url, resolve, undefined, reject);
        });
        break;

      default:
        console.error(`Unsupported file format: ${extension}`);

        return new BoxGeometry(0, 0, 0);
    }

    context.cache.set(name, result);

    return result;
  } catch (error) {
    console.error(`Error loading model ${name}:`, error);

    return new BoxGeometry(0, 0, 0);
  }
}

export function useElementRenderer() {
  const { currentComponents } = storeToRefs(useDeckStore());
  const { meshes } = storeToRefs(useAssetsStore());

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

        const mesh = findComponent(node, "mesh")!.data;

        const getGeometry = (type: string) => {
          switch (type) {
            case "box":
              return new BoxGeometry(1, 1, 1);

            case "icosahedron":
              return new IcosahedronGeometry();

            case "triangle":
              return new TetrahedronGeometry();

            case "sphere":
              return new SphereGeometry(0.5, 32, 32);

            default:
              return new BoxGeometry(0, 0, 0);
          }
        };

        console.log("adding object", mesh.type);

        if (context?.objects.has(node.id)) {
          const object = context?.objects.get(node.id);

          console.log("Existing object:", object);

          if (
            (object instanceof Mesh &&
              object.geometry.type.toLowerCase() !== mesh.type.toLowerCase()) ||
            (object instanceof Group &&
              !["box", "icosahedron", "triangle", "sphere"].includes(
                object.type
              ))
          ) {
            console.log(
              "Type changed or switching between custom model and primitive"
            );

            context.scene.remove(object);

            if (
              ["box", "icosahedron", "triangle", "sphere"].includes(mesh.type)
            ) {
              console.log("Switching to primitive:", mesh.type);

              const geometry = getGeometry(mesh.type);
              const material = new MeshBasicMaterial({ color: mesh.colour });
              const newObject = new Mesh(geometry, material);

              newObject.position.set(mesh.x, mesh.y, mesh.z);
              context.objects.set(node.id, newObject);
              context.scene.add(newObject);
            } else if (meshes.value.some((asset) => asset.name === mesh.type)) {
              console.log("Switching to custom model:", mesh.type);

              loadMesh(context, mesh.type).then((geometry) => {
                console.log("Custom model loaded:", geometry);

                let newObject: Mesh | Group;

                if (geometry instanceof BufferGeometry) {
                  const material = new MeshBasicMaterial({
                    color: mesh.colour,
                  });

                  newObject = new Mesh(geometry, material);
                } else if (geometry instanceof Group) {
                  newObject = geometry;

                  geometry.traverse((child) => {
                    if (child instanceof Mesh) {
                      child.material = new MeshBasicMaterial({
                        color: mesh.colour,
                      });
                    }
                  });
                } else {
                  const material = new MeshBasicMaterial({
                    color: mesh.colour,
                  });

                  newObject = new Mesh(new BoxGeometry(0, 0, 0), material);
                }

                newObject.position.set(mesh.x, mesh.y, mesh.z);

                context.objects.set(node.id, newObject);
                context.scene.add(newObject);
              });
            }
            return {};
          }

          if (object instanceof Mesh) {
            (object.material as MeshBasicMaterial).color.set(mesh.colour);
          } else if (object instanceof Group) {
            object.traverse((child) => {
              if (child instanceof Mesh) {
                (child.material as MeshBasicMaterial).color.set(mesh.colour);
              }
            });
          }

          object?.position.set(mesh.x, mesh.y, mesh.z);
          return {};
        } else {
          if (
            ["box", "icosahedron", "triangle", "sphere"].includes(mesh.type)
          ) {
            const geometry = getGeometry(mesh.type);
            const material = new MeshBasicMaterial({ color: mesh.colour });
            const object = new Mesh(geometry, material);

            object.position.set(mesh.x, mesh.y, mesh.z);

            context?.objects.set(node.id, object);
            context?.scene.add(object);

            return {};
          } else if (
            meshes.value.some((asset) => asset.name === mesh.type) &&
            context
          ) {
            loadMesh(context, mesh.type).then((geometry) => {
              let object: Mesh | Group;

              if (geometry instanceof BufferGeometry) {
                const material = new MeshBasicMaterial({ color: mesh.colour });

                object = new Mesh(geometry, material);
              } else if (geometry instanceof Group) {
                object = geometry;

                geometry.traverse((child) => {
                  if (child instanceof Mesh) {
                    child.material = new MeshBasicMaterial({
                      color: mesh.colour,
                    });
                  }
                });
              } else {
                const material = new MeshBasicMaterial({ color: mesh.colour });

                object = new Mesh(new BoxGeometry(0, 0, 0), material);
              }

              object.position.set(mesh.x, mesh.y, mesh.z);

              context?.objects.set(node.id, object);
              context?.scene.add(object);
            });

            return {};
          } else {
            const geometry = new BoxGeometry(1, 1, 1);
            const material = new MeshBasicMaterial({ color: mesh.colour });
            const object = new Mesh(geometry, material);

            object.position.set(mesh.x, mesh.y, mesh.z);

            context?.objects.set(node.id, object);
            context?.scene.add(object);

            return {};
          }
        }
      },
    },
  };

  return {
    renderer,
    setupCanvas,
  };
}
