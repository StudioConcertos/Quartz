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
} from "three";

const canvasContext = new Map<
  string,
  {
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    objects: Map<string, Mesh>;
  }
>();

const hasAnimated = ref(false);

function setupCanvas(canvas: string) {
  document
    .getElementById(canvas)
    ?.appendChild(canvasContext.get(canvas)!.renderer.domElement);

  if (!hasAnimated.value) {
    animate();

    hasAnimated.value = true;
  }
}

function animate() {
  requestAnimationFrame(animate);

  canvasContext.forEach((context) => {
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
            const context = canvasContext.get(node.id);

            if (!context) return;

            context.camera.aspect = newAspectRatio;
            context.camera.updateProjectionMatrix();

            context.renderer.setSize(transform.width, transform.height);
          }
        );

        if (!canvasContext.has(node.id)) {
          canvasContext.set(node.id, {
            scene: new Scene(),
            camera: new PerspectiveCamera(
              75,
              transform.width / transform.height,
              0.1,
              1000
            ),
            renderer: new WebGLRenderer({ antialias: true }),
            objects: new Map(),
          });
        }

        const context = canvasContext.get(node.id);

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
        const context = canvasContext.get(node.parent!.id);

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

          if (object && object.geometry.type !== mesh.type) {
            object.geometry.dispose();
            object.geometry = getGeometry(mesh.type);
          }

          (object?.material as MeshBasicMaterial).color.set(mesh.colour);

          object?.position.set(mesh.x, mesh.y, mesh.z);

          return {};
        } else {
          const geometry = getGeometry(mesh.type);
          const material = new MeshBasicMaterial({ color: mesh.colour });
          const object = new Mesh(geometry, material);

          if (context?.objects.has(node.id)) {
            return {};
          }

          context?.objects.set(node.id, object);

          context?.scene.add(object);

          console.log(context?.scene.children);

          object.position.set(mesh.x, mesh.y, mesh.z);

          console.log(mesh.x);

          return {};
        }
      },
    },
  };

  return {
    renderer,
    setupCanvas,
  };
}
