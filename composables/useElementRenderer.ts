// TODO: Refactor this whole mess.

// ! = Required component; ? = Optional component.

import {
  BoxGeometry,
  BufferGeometry,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TetrahedronGeometry,
  WebGLRenderer,
} from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

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
    // Animate the scene (for testing)
    context.scene.children.forEach((child) => {
      child.rotation.x += 0.01;
      child.rotation.y += 0.01;
    });

    context.renderer.render(context.scene, context.camera);
  });
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
            } else {
              console.log("Switching to custom model:", mesh.type);

              loadModel(context, mesh.type).then((geometry) => {
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
          } else if (context) {
            loadModel(context, mesh.type).then((geometry) => {
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

              context.objects.set(node.id, object);
              context.scene.add(object);
            });

            return {};
          } else {
            const geometry = new BoxGeometry(1, 1, 1);
            const material = new MeshBasicMaterial({ color: mesh.colour });
            const object = new Mesh(geometry, material);

            object.position.set(mesh.x, mesh.y, mesh.z);

            if (context) {
              (context as CanvasContext).objects.set(node.id, object);
              (context as CanvasContext).scene.add(object);
            }

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
