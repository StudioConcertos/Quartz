// TODO: Refactor this whole mess.

// ! = Required component; ? = Optional component.

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
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

function setupCanvas() {
  document
    .getElementById("c115e1c6-cf92-4345-93a5-4bfdcad3db44")
    ?.appendChild(canvasContext.get("0")!.renderer.domElement);
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

        if (!canvasContext.has("0")) {
          canvasContext.set("0", {
            scene: new Scene(),
            camera: new PerspectiveCamera(
              75,
              // TOFIX: This is not reactive.
              transform.width / transform.height,
              0.1,
              1000
            ),
            renderer: new WebGLRenderer({ antialias: true }),
            objects: new Map(),
          });
        }

        const context = canvasContext.get("0");

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
        const context = canvasContext.get("0");

        const mesh = findComponent(node, "mesh")!.data;

        console.log("adding cube");

        if (context?.objects.has(node.id)) {
          const cube = context?.objects.get(node.id);

          (cube?.material as MeshBasicMaterial).color.set(mesh.colour);

          return {};
        } else {
          const geometry = new BoxGeometry(1, 1, 1);
          const material = new MeshBasicMaterial({ color: mesh.colour });
          const cube = new Mesh(geometry, material);

          if (context?.objects.has(node.id)) {
            return {};
          }

          context?.objects.set(node.id, cube);

          context?.scene.add(cube);

          console.log(context?.scene.children);

          return {};
        }
      },
    },
  };

  return {
    renderer,
    animate,
    setupCanvas,
  };
}
