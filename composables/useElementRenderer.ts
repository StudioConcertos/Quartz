// TODO: Optimise the amount of calls.

// ! = Required component; ? = Optional component.

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from "three";

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
      element: "canvas",
      render: (node: Tree) => {
        const scene = new Scene();
        const camera = new PerspectiveCamera(
          75,
          width.value / height.value,
          0.1,
          1000
        );
        const renderer = new WebGLRenderer({ antialias: true });

        renderer.setSize(width.value, height.value);
        renderEl.value!.appendChild(renderer.domElement);
        camera.position.z = 5;

        var geometry = new BoxGeometry(1, 1, 1);
        var material = new MeshBasicMaterial({ color: "#433F81" });
        var cube = new Mesh(geometry, material);

        scene.add(cube);

        renderer.render(scene, camera);

        return {
          style: {
            width: `${width.value}px`,
            height: `${height.value}px`,
          },
        };
      },
    },
  };

  return {
    renderer,
  };
}
