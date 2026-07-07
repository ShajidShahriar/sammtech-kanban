# Framer Motion & Drag-and-Drop Integration

## The Problem: Animation Engine Conflict

When combining `framer-motion` (for shared layout animations and modal morphing) with `@hello-pangea/dnd` (or `react-beautiful-dnd`) for drag-and-drop, the two animation engines can conflict during the drag gesture and drop settlement. 

If a `<motion.div>` (or custom `MotionCard`) is given the `layout` or `layoutId` prop while actively wrapped in a `<Draggable>`, a severe visual conflict occurs upon dropping the item:
1. **The Jagged Snap**: `@hello-pangea/dnd` uses hardware-accelerated inline CSS transforms (`transform: translate(...)`) to smoothly drop the card into its target placeholder. Simultaneously, Framer Motion detects a DOM layout shift (the placeholder being removed) and attempts to animate the exact same coordinates using its `layout` projection engine. The two engines fight over the element's position, resulting in a jarring, jagged oscillation.
2. **Performance Jitter**: Using `layout={true}` forces Framer Motion to recalculate both position and size (width/height). For simple cards that don't change size during a drag, this causes unnecessary performance overhead and visual jitter.
3. **Underdamped Physics**: Using a loose spring configuration (e.g., `stiffness: 200, damping: 15`) creates an underdamped system. While a bouncy spring looks good for simple buttons, applying it to a complex drag-and-drop grid amplifies the jaggedness caused by the engine conflict.

## The Solution

To resolve this, we strictly separated the responsibilities of the two engines: **DND owns the drag and drop**, and **Framer Motion owns the idle state and morphing**.

### 1. Conditional Layout Props
We conditionally disabled Framer Motion's `layout` and `layoutId` props while the item is actively being dragged. We read the `isDragging` boolean from the DND `snapshot` parameter:

```tsx
<Draggable draggableId={task.id} index={index}>
  {(provided, snapshot) => (
    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
      <MotionCard
        // Turn off layout calculation during drag to let DND own the transform
        layout={!snapshot.isDragging ? "position" : false}
        layoutId={!snapshot.isDragging ? task.id : undefined}
        transition={springTransition}
      >
        {/* Card Content */}
      </MotionCard>
    </div>
  )}
</Draggable>
```

### 2. Optimize Layout Projection
Instead of `layout={true}`, we use `layout="position"`. This tells Framer Motion to only animate the `x` and `y` coordinates when reordering idle cards, bypassing expensive and unnecessary width/height recalculations.

### 3. Critically Damped Spring Physics
We updated the `springTransition` to use a "critically damped" configuration. This ensures that when Framer Motion *does* animate the layout (like when cards shuffle out of the way, or when the card morphs into a modal), it snaps precisely to its destination without overshooting or oscillating.

```typescript
export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 24, // High damping eliminates bounciness
  mass: 0.8,
};
```

### 4. Separation of Props
We ensured that the DND `provided.draggableProps.style` (which contains the raw CSS transforms) is applied to an outer, plain HTML `<div>`, while the Framer Motion `layout` props are applied to the inner `<MotionCard>`. Spreading them onto the same element is a common mistake that guarantees engine collision.
