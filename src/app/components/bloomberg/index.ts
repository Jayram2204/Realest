/**
 * Bloomberg Terminal Features - Modular Components
 *
 * Phase 1: Command Infrastructure ✓
 * - CommandSidebar: Collapsible navigation (Cmd+B to toggle)
 * - CommandPalette: Global search (Cmd+K to open)
 *
 * Phase 2: Financial Widgets ✓
 * - ClaimableEarnings: Dividend withdrawal widget with confetti
 * - FinancialTerminal: Portfolio performance sidebar
 * - YieldCalculator: APY/APR projections with charts
 *
 * Phase 3: Transaction Intelligence ✓
 * - TransactionLifecycle: 4-stage escrow progress tracker
 * - InspectorPanel: Slide-out detail panel system
 * - ChainOfTrust: Trust score & provenance display
 *
 * Phase 4: Advanced Layouts ✓
 * - PropertyNavigator: Virtual scrolling property list
 * - ThreeColumnLayout: Bloomberg terminal 3-column layout
 * - PropertyDetails3D: 2.5D isometric visualization
 * - SkeletonLoaders: Loading state components
 *
 * Phase 5: Dark Mode & Polish ✓
 * - ThemeToggle: Dark/light mode switcher
 * - ThemeProvider: Theme context and persistence
 */

// Phase 1: Command Infrastructure
export { CommandSidebar } from "./CommandSidebar";
export { CommandPalette } from "./CommandPalette";

// Phase 2: Financial Widgets
export { ClaimableEarnings } from "./ClaimableEarnings";
export { FinancialTerminal } from "./FinancialTerminal";
export { YieldCalculator } from "./YieldCalculator";

// Phase 3: Transaction Intelligence
export { TransactionLifecycle } from "./TransactionLifecycle";
export { InspectorPanel, InspectorSection, InspectorField, InspectorCard } from "./InspectorPanel";
export { ChainOfTrust } from "./ChainOfTrust";

// Phase 4: Advanced Layouts
export { PropertyNavigator } from "./PropertyNavigator";
export { ThreeColumnLayout } from "./ThreeColumnLayout";
export { PropertyDetails3D } from "./PropertyDetails3D";
export * from "./SkeletonLoaders";

// Phase 5: Dark Mode & Polish
export { ThemeToggle, ThemeToggleCompact } from "./ThemeToggle";
