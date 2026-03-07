import { useState, useEffect } from "react";

import EditorialCalendar from "./admin/EditorialCalendar";
import PollManager from "./admin/PollManager";
import CommentModeration from "./admin/CommentModeration";
import TeamManager from "./admin/TeamManager";

const LOGO_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAClM0lEQVR42uydeZhcVZn/v+85595bunpN0p19D4EOmwYRFOzQgKI0m1o94+jMODMOOOCu4zIqlUIRl3FcRhjhp8444zYpN7BxQwKtjOASZW22JGTft16r6t5z3vf3x61OOhAgQAeScD7PU08nXUvfuufe8z3vct4X8Hg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Rxt+I6HHM94UCgpLbk/Kn9y+hH0/c4/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Rxt+I6HHM94UCgpLbk/Kn9y+hH0/c4/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Rxt+I6HHM94UCgpLbk/Kn9y+hH0/c4/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Rxt+I6HHM94UCgpLbk/Kn9y+hH0/c4/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Rxt+I6HHM94UCgpLbk/Kn9y+hH0/c4/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Rxt+I6HHM94UCgpLbk/Kn9y+hH0/c4/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Rxt+I6HHM94UCgpLbk/Kn9y+hH0/c4/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Rxt+I6HHM94UCgpLbk/Kn9y+hH0/c4/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Rxt+I6HHM94UCgpLbk/Kn9y+hH0/c4/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8Rxt+I6HHM94UCgpLbk/Kn9y+hH0/c4/H4/F4PB6Px+PxeDwej8fj8Xg8Ho/H4/F4PB6Px+PxeDwej8fj8Xg8AAAAABJRU5ErkJggg==";

// ═══════════════════════════════════════════════════════════════
//  MENA Watch — AdminDashboard v2
//  الأقسام:
//  1. مراجعة التقرير
//  2. الإعدادات
//  3. الأرشيف
//  4. قوالب الإيميل
//  5. وسائل التواصل الاجتماعي ← جديد
//  6. بيانات الشركة والعلامة التجارية ← جديد
// ═══════════════════════════════════════════════════════════════

// ── Mock data (existing) ─────────────────────────────────────
const MOCK_DRAFT_REPORT = {
  id: "rpt_2026_03_06", date: "الخميس، ٦ مارس ٢٠٢٦",
  status: "draft", generated_at: "05:45:12", subscribers_count: 1247,
  market: {
    tasi:  { val: "12,847", chg: "+0.42%", up: true  },
    brent: { val: "82.14",  chg: "-0.8%",  up: false },
    gold:  { val: "2,318",  chg: "+0.3%",  up: true  },
    sar:   { val: "3.751",  chg: "ثابت",   up: null  },
  },
  analysis: `**الملخص التنفيذي**\nيشهد الشرق الأوسط اليوم تقاطعاً بين ثلاثة محاور رئيسية: استمرار الضغط على ممرات الشحن في البحر الأحمر، وتثبيت أوبك+ لمستويات الإنتاج، وتسارع الاستثمارات التقنية السعودية في مجال الذكاء الاصطناعي.\n\n**المشهد الأمني**\nتواصل القوات اليمنية إعلان الهدنة من جانب واحد مع استمرار مفاوضات السلام في جنيف.\n\n**النبض الاقتصادي**\nأرامكو تُعلن أرباح الربع الأول بتجاوز للتوقعات بنسبة 12%. تاسي يواصل صعوده للجلسة الثالثة على التوالي.`,
  defcon: [
    { region: "اليمن",    level: 2, trend: "مستقر"  },
    { region: "السودان",  level: 3, trend: "تصاعد"  },
    { region: "إيران",    level: 3, trend: "مستقر"  },
    { region: "السعودية", level: 5, trend: "مستقر"  },
  ],
};

const MOCK_ARCHIVE = [
  { id: "arc_2026_02", period: "فبراير ٢٠٢٦", type: "monthly", reports: 28, pages: 112, status: "published", price: 49, downloads: 23 },
  { id: "arc_2026_01", period: "يناير ٢٠٢٦",  type: "monthly", reports: 31, pages: 124, status: "published", price: 49, downloads: 41 },
  { id: "arc_2025",    period: "العام ٢٠٢٥",  type: "annual",  reports: 365, pages: 1460, status: "published", price: 199, downloads: 18 },
  { id: "arc_2026_03", period: "مارس ٢٠٢٦",  type: "monthly", reports: 6,  pages: 24,  status: "in_progress", price: 49, downloads: 0 },
];

const MOCK_SETTINGS = {
  send_time: "06:00", timezone: "Asia/Riyadh",
  review_mode: true, review_deadline_minutes: 30,
  auto_send_if_no_review: false, max_retries: 3, batch_size: 50, delay_ms: 100,
};

const MOCK_EMAIL_TEMPLATES = [
  { id: "welcome",      name: "إيميل الترحيب",    subject: "🌍 أهلاً بك في MENA Watch", last_edited: "١٥ فبراير ٢٠٢٦", sends: 1247, html: "<div>ترحيب</div>" },
  { id: "daily_report", name: "التقرير الصباحي",   subject: "📊 تقرير MENA Watch — {{date}}", last_edited: "٢٠ فبراير ٢٠٢٦", sends: 38641, html: "<div>تقرير</div>" },
  { id: "defcon_alert", name: "تنبيه DEFCON",       subject: "🚨 تنبيه DEFCON — {{region}}", last_edited: "١ مارس ٢٠٢٦", sends: 892, html: "<div>تنبيه</div>" },
];

// ── Mock: Social Media ────────────────────────────────────────
const DEFAULT_SOCIAL = [
  { id: "x",         icon: "𝕏",   label: "X (تويتر)", handle: "TheMenaWatch",  url: "https://x.com/TheMenaWatch",         active: true  },
  { id: "tiktok",    icon: "♪",   label: "TikTok",    handle: "themenawatch",  url: "https://tiktok.com/@themenawatch",    active: true  },
  { id: "facebook",  icon: "f",   label: "Facebook",  handle: "Mena.Watch",    url: "https://facebook.com/Mena.Watch",     active: true  },
  { id: "snapchat",  icon: "👻",  label: "Snapchat",  handle: "Mena Watch",    url: "",                                    active: false },
  { id: "linkedin",  icon: "in",  label: "LinkedIn",  handle: "Mena Watch",    url: "https://linkedin.com/company/mena-watch", active: true  },
  { id: "instagram", icon: "📸",  label: "Instagram", handle: "Mena.Watch",    url: "https://instagram.com/mena.watch",    active: true  },
  { id: "threads",   icon: "🧵",  label: "Threads",   handle: "Mena.Watch",    url: "https://threads.net/@mena.watch",     active: true  },
  { id: "youtube",   icon: "▶",   label: "YouTube",   handle: "Mena.Watch",    url: "https://youtube.com/@MenaWatch",      active: true  },
];

// ── Mock: Company Info ────────────────────────────────────────
const DEFAULT_COMPANY = {
  // بيانات المنصة
  platform_name_en:     "MENA Watch",
  platform_name_ar:     "مينا ووتش",
  platform_tagline_ar:  "منصة الاستخبارات الاستراتيجية للشرق الأوسط",
  platform_tagline_en:  "Strategic Intelligence Platform for the Middle East",
  platform_url:         "https://mena.watch",
  platform_email:       "info@mena.watch",
  platform_phone:       "+966 5X XXX XXXX",
  // بيانات الشركة
  company_name_ar:      "شركة مينا ووتش للتقنية",
  company_name_en:      "MENA Watch Technology Co.",
  commercial_register:  "10XXXXXXXXX",
  vat_number:           "3XXXXXXXXXXXXXXX",
  unified_number:       "70XXXXXXXX",
  // العنوان
  address_ar:           "المملكة العربية السعودية، الرياض",
  address_en:           "Riyadh, Kingdom of Saudi Arabia",
  zip_code:             "XXXXX",
  // بيانات البنك (للفواتير)
  bank_name:            "البنك الأهلي السعودي",
  iban:                 "SA00 0000 0000 0000 0000 0000",
  // الاشتراطات القانونية (ZATCA)
  zatca_phase:          "2",
  invoice_prefix:       "MENA",
  show_vat_on_invoice:  true,
  show_cr_on_invoice:   true,
  currency:             "SAR",
  vat_rate:             "15",
};

// ── Helpers ──────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return <div style={{ background:"#0a1628", border:"1px solid #1e293b", borderRadius:8, padding:16, ...style }}>{children}</div>;
}
function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width:40, height:22, borderRadius:11, cursor:"pointer", transition:"all 0.3s",
      background: value ? "#22c55e" : "#1e293b", border:`1px solid ${value ? "#22c55e" : "#334155"}`,
      position:"relative", flexShrink:0,
    }}>
      <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", position:"absolute", top:3, transition:"all 0.3s", left: value ? 21 : 3 }} />
    </div>
  );
}
function Input({ label, value, onChange, placeholder, type="text", mono=false }) {
  return (
    <div>
      {label && <label style={{ fontSize:10, color:"#475569", display:"block", marginBottom:6, letterSpacing:1 }}>{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width:"100%", background:"#060d18", border:"1px solid #1e293b", borderRadius:5,
          padding:"8px 12px", color:"#f8fafc", fontSize:12, fontFamily: mono ? "'Courier New', monospace" : "inherit",
          direction: mono ? "ltr" : "rtl", textAlign: mono ? "left" : "right",
        }} />
    </div>
  );
}
const defconColors = { 1:"#ef4444", 2:"#f87171", 3:"#f59e0b", 4:"#3b82f6", 5:"#22c55e" };

// ──────────────────────────────────────────────────────────────
// SECTION 1: مراجعة التقرير
// ──────────────────────────────────────────────────────────────
function ReviewSection() {
  const r = MOCK_DRAFT_REPORT;
  const [editMode, setEditMode] = useState(false);
  const [editedAnalysis, setEditedAnalysis] = useState(r.analysis);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (sent) return (
    <Card style={{ textAlign:"center", padding:40 }}>
      <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
      <div style={{ fontSize:16, fontWeight:700, color:"#22c55e" }}>تم الإرسال بنجاح!</div>
      <div style={{ fontSize:12, color:"#64748b", marginTop:6 }}>أُرسل لـ {r.subscribers_count.toLocaleString("ar")} مشترك</div>
    </Card>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <Card>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
          {[ { label:"التاريخ", val:r.date, c:"#f8fafc" }, { label:"وقت التوليد", val:r.generated_at, c:"#f59e0b" }, { label:"المشتركون", val:r.subscribers_count.toLocaleString("ar"), c:"#22c55e" }, { label:"الحالة", val:"مسودة", c:"#f59e0b" } ].map(s => (
            <div key={s.label}><div style={{ fontSize:9, color:"#475569", marginBottom:4 }}>{s.label}</div><div style={{ fontSize:13, fontWeight:700, color:s.c }}>{s.val}</div></div>
          ))}
        </div>
      </Card>
      <Card>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <span style={{ fontSize:11, color:"#22c55e", fontWeight:700 }}>● تحليل Claude AI — قابل للتعديل</span>
          <button onClick={() => setEditMode(!editMode)} style={{ padding:"4px 12px", borderRadius:5, fontSize:10, fontFamily:"inherit", cursor:"pointer", background: editMode?"#22c55e18":"#1e293b", border:`1px solid ${editMode?"#22c55e":"#334155"}`, color: editMode?"#22c55e":"#94a3b8" }}>
            {editMode ? "✓ حفظ" : "✏️ تعديل"}
          </button>
        </div>
        {editMode
          ? <textarea value={editedAnalysis} onChange={e => setEditedAnalysis(e.target.value)} style={{ width:"100%", minHeight:240, background:"#060d18", border:"1px solid #22c55e44", borderRadius:8, padding:12, color:"#cbd5e1", fontSize:12, lineHeight:1.8, fontFamily:"inherit", direction:"rtl", resize:"vertical" }} />
          : <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.9, whiteSpace:"pre-wrap", background:"#060d18", borderRadius:8, padding:12, border:"1px solid #1e293b", maxHeight:240, overflow:"auto" }}>{editedAnalysis}</div>
        }
      </Card>
      <Card>
        <div style={{ fontSize:10, color:"#64748b", marginBottom:10 }}>مؤشرات DEFCON</div>
        <div style={{ display:"flex", gap:8 }}>
          {r.defcon.map(d => (
            <div key={d.region} style={{ padding:"6px 12px", borderRadius:6, background:defconColors[d.level]+"22", border:`1px solid ${defconColors[d.level]}55` }}>
              <div style={{ fontSize:11, color:"#e2e8f0" }}>{d.region}</div>
              <div style={{ fontSize:14, fontWeight:800, color:defconColors[d.level] }}>D{d.level}</div>
              <div style={{ fontSize:9, color:"#64748b" }}>{d.trend}</div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={async () => { setSending(true); await new Promise(r=>setTimeout(r,2000)); setSending(false); setSent(true); }} disabled={sending} style={{ flex:1, padding:"14px 0", borderRadius:8, border:"none", background:sending?"#1e293b":"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", fontSize:14, fontWeight:800, fontFamily:"inherit", cursor:sending?"default":"pointer" }}>
          {sending ? `⏳ جاري الإرسال لـ ${r.subscribers_count.toLocaleString("ar")} مشترك...` : "✅ اعتماد وإرسال الآن"}
        </button>
        <button style={{ padding:"14px 20px", borderRadius:8, border:"1px solid #ef444455", background:"#7f1d1d22", color:"#ef4444", fontSize:13, fontWeight:700, fontFamily:"inherit", cursor:"pointer" }}>❌ رفض</button>
        <button style={{ padding:"14px 20px", borderRadius:8, border:"1px solid #334155", background:"#1e293b", color:"#94a3b8", fontSize:13, fontWeight:700, fontFamily:"inherit", cursor:"pointer" }}>🔄 إعادة توليد</button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SECTION 2: الإعدادات
// ──────────────────────────────────────────────────────────────
function SettingsSection() {
  const [s, setS] = useState(MOCK_SETTINGS);
  const [saved, setSaved] = useState(false);
  const update = (k, v) => setS(prev => ({...prev, [k]: v}));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <Card>
        <div style={{ fontSize:11, color:"#64748b", marginBottom:14, fontWeight:700 }}>⏰ جدول الإرسال</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={{ fontSize:10, color:"#64748b", display:"block", marginBottom:6 }}>وقت الإرسال</label>
            <input type="time" value={s.send_time} onChange={e => update("send_time", e.target.value)} style={{ width:"100%", background:"#060d18", border:"1px solid #1e293b", borderRadius:6, padding:"8px 12px", color:"#f8fafc", fontSize:14, fontFamily:"inherit" }} />
          </div>
          <div>
            <label style={{ fontSize:10, color:"#64748b", display:"block", marginBottom:6 }}>المنطقة الزمنية</label>
            <select value={s.timezone} onChange={e => update("timezone", e.target.value)} style={{ width:"100%", background:"#060d18", border:"1px solid #1e293b", borderRadius:6, padding:"8px 12px", color:"#f8fafc", fontSize:12, fontFamily:"inherit" }}>
              <option value="Asia/Riyadh">Asia/Riyadh (UTC+3)</option>
              <option value="Asia/Dubai">Asia/Dubai (UTC+4)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </Card>
      <Card>
        <div style={{ fontSize:11, color:"#64748b", marginBottom:14, fontWeight:700 }}>🔍 وضع المراجعة</div>
        {[ { k:"review_mode", l:"تفعيل المراجعة قبل الإرسال", d:"التقرير يُحفظ كمسودة وينتظر اعتمادك" }, { k:"auto_send_if_no_review", l:"إرسال تلقائي إذا لم يُراجع", d:"يُرسل تلقائياً إذا انتهت مهلة المراجعة" } ].map(opt => (
          <div key={opt.k} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#060d18", borderRadius:8, padding:"10px 14px", border:"1px solid #1e293b", marginBottom:8 }}>
            <div><div style={{ fontSize:12, color:"#e2e8f0", fontWeight:600 }}>{opt.l}</div><div style={{ fontSize:10, color:"#475569" }}>{opt.d}</div></div>
            <Toggle value={s[opt.k]} onChange={v => update(opt.k, v)} />
          </div>
        ))}
      </Card>
      <button onClick={async () => { await new Promise(r=>setTimeout(r,600)); setSaved(true); setTimeout(()=>setSaved(false),3000); }} style={{ padding:"12px 0", borderRadius:8, border:"none", background:saved?"#14532d":"linear-gradient(135deg,#3b82f6,#2563eb)", color:"#fff", fontSize:13, fontWeight:700, fontFamily:"inherit", cursor:"pointer" }}>
        {saved ? "✅ تم الحفظ" : "💾 حفظ الإعدادات"}
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SECTION 3: الأرشيف
// ──────────────────────────────────────────────────────────────
function ArchiveSection() {
  const [gen, setGen] = useState(null);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
        {[ { l:"هذا الشهر", v:"6", c:"#3b82f6" }, { l:"إجمالي الأرشيف", v:"65", c:"#22c55e" }, { l:"للبيع", v:"3", c:"#f59e0b" }, { l:"الإيرادات", v:"$2,891", c:"#8b5cf6" } ].map(s => (
          <Card key={s.l}><div style={{ fontSize:9, color:"#475569" }}>{s.l}</div><div style={{ fontSize:22, fontWeight:800, color:s.c, marginTop:4 }}>{s.v}</div></Card>
        ))}
      </div>
      <Card>
        <div style={{ fontSize:11, color:"#64748b", marginBottom:12, fontWeight:700 }}>📚 الأرشيف المتاح</div>
        {MOCK_ARCHIVE.map(a => (
          <div key={a.id} style={{ display:"flex", alignItems:"center", gap:10, background:"#060d18", border:"1px solid #1e293b", borderRadius:8, padding:"10px 14px", marginBottom:6 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#e2e8f0" }}>{a.period}</div>
              <div style={{ fontSize:9, color:"#475569" }}>{a.type==="annual"?"سنوي":"شهري"} — {a.reports} تقرير</div>
            </div>
            <span style={{ background:a.status==="published"?"#22c55e22":"#f59e0b22", color:a.status==="published"?"#22c55e":"#f59e0b", border:`1px solid ${a.status==="published"?"#22c55e44":"#f59e0b44"}`, padding:"2px 8px", borderRadius:4, fontSize:10, fontWeight:700 }}>
              {a.status==="published"?"منشور":"جاري"}
            </span>
            <div style={{ fontSize:12, fontWeight:700, color:"#f8fafc" }}>${a.price}</div>
            <div style={{ fontSize:11, color:"#64748b" }}>{a.downloads} تحميل</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SECTION 4: قوالب الإيميل
// ──────────────────────────────────────────────────────────────
function TemplatesSection() {
  const [active, setActive] = useState("welcome");
  const [templates, setTemplates] = useState(MOCK_EMAIL_TEMPLATES);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const tmpl = templates.find(t => t.id === active);
  const update = (f, v) => setTemplates(prev => prev.map(t => t.id===active ? {...t,[f]:v} : t));

  return (
    <div style={{ display:"flex", gap:14 }}>
      <div style={{ flex:"0 0 200px", display:"flex", flexDirection:"column", gap:6 }}>
        {templates.map(t => (
          <div key={t.id} onClick={() => { setActive(t.id); setEditing(false); }} style={{ padding:"10px 12px", borderRadius:8, cursor:"pointer", background:active===t.id?"#1e3a5f":"#0a1628", border:`1px solid ${active===t.id?"#3b82f6":"#1e293b"}` }}>
            <div style={{ fontSize:12, fontWeight:700, color:active===t.id?"#93c5fd":"#e2e8f0" }}>{t.name}</div>
            <div style={{ fontSize:9, color:"#475569", marginTop:2 }}>{t.sends.toLocaleString("ar")} إرسال</div>
          </div>
        ))}
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10 }}>
        <Card>
          <label style={{ fontSize:10, color:"#64748b", display:"block", marginBottom:6 }}>العنوان (Subject)</label>
          <input value={tmpl.subject} onChange={e => update("subject", e.target.value)} style={{ width:"100%", background:"#060d18", border:"1px solid #1e293b", borderRadius:6, padding:"8px 12px", color:"#f8fafc", fontSize:12, fontFamily:"inherit", direction:"rtl" }} />
        </Card>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <span style={{ fontSize:10, color:"#64748b", fontWeight:700 }}>محتوى HTML</span>
            <button onClick={() => setEditing(!editing)} style={{ padding:"4px 10px", borderRadius:5, fontSize:10, fontFamily:"inherit", cursor:"pointer", background:editing?"#22c55e18":"transparent", border:`1px solid ${editing?"#22c55e":"#334155"}`, color:editing?"#22c55e":"#64748b" }}>✏️ تعديل</button>
          </div>
          {editing
            ? <textarea value={tmpl.html} onChange={e => update("html", e.target.value)} style={{ width:"100%", minHeight:240, background:"#060d18", border:"1px solid #22c55e44", borderRadius:8, padding:12, color:"#a3e635", fontSize:11, lineHeight:1.6, fontFamily:"'Courier New',monospace", direction:"ltr", resize:"vertical" }} />
            : <div style={{ background:"#060d18", borderRadius:8, padding:12, minHeight:100, fontSize:11, color:"#64748b", border:"1px solid #1e293b", display:"flex", alignItems:"center", justifyContent:"center" }}>📧 اضغط تعديل لعرض الكود</div>
          }
        </Card>
        <button onClick={async () => { await new Promise(r=>setTimeout(r,600)); setSaved(true); setTimeout(()=>setSaved(false),3000); }} style={{ padding:"11px 0", borderRadius:8, border:"none", background:saved?"#14532d":"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", fontSize:13, fontWeight:700, fontFamily:"inherit", cursor:"pointer" }}>
          {saved ? "✅ تم الحفظ" : "💾 حفظ القالب"}
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SECTION 5: وسائل التواصل الاجتماعي ← جديد
// ──────────────────────────────────────────────────────────────
function SocialSection() {
  const [socials, setSocials] = useState(DEFAULT_SOCIAL);
  const [saved, setSaved] = useState(false);

  const update = (id, field, val) => setSocials(prev => prev.map(s => s.id===id ? {...s,[field]:val} : s));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

      <Card>
        <div style={{ fontSize:11, color:"#64748b", marginBottom:6 }}>
          إدارة حسابات وسائل التواصل الاجتماعي — تحكم في ظهورها في الـ Footer وفي صفحات الموقع
        </div>
      </Card>

      {socials.map(s => (
        <Card key={s.id}>
          <div style={{ display:"grid", gridTemplateColumns:"40px 120px 1fr 1fr 80px", alignItems:"center", gap:12 }}>
            {/* Icon */}
            <div style={{ width:36, height:36, borderRadius:8, background:"#22c55e22", border:"1px solid #22c55e44", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
              {s.icon}
            </div>
            {/* Platform label */}
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"#f8fafc" }}>{s.label}</div>
              <div style={{ fontSize:9, color:s.active?"#22c55e":"#64748b", marginTop:2 }}>
                {s.active ? "● ظاهر في الموقع" : "○ مخفي"}
              </div>
            </div>
            {/* Handle */}
            <div>
              <label style={{ fontSize:9, color:"#475569", display:"block", marginBottom:4 }}>اسم المستخدم</label>
              <input value={s.handle} onChange={e => update(s.id, "handle", e.target.value)}
                style={{ width:"100%", background:"#060d18", border:"1px solid #1e293b", borderRadius:5, padding:"6px 10px", color:"#f8fafc", fontSize:12, fontFamily:"inherit", direction:"ltr", textAlign:"left" }} />
            </div>
            {/* URL */}
            <div>
              <label style={{ fontSize:9, color:"#475569", display:"block", marginBottom:4 }}>الرابط الكامل</label>
              <input value={s.url} onChange={e => update(s.id, "url", e.target.value)} placeholder="https://..."
                style={{ width:"100%", background:"#060d18", border:"1px solid #1e293b", borderRadius:5, padding:"6px 10px", color:"#94a3b8", fontSize:11, fontFamily:"'Courier New',monospace", direction:"ltr", textAlign:"left" }} />
            </div>
            {/* Toggle */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ fontSize:9, color:"#475569" }}>إظهار في الموقع</div>
              <Toggle value={s.active} onChange={v => update(s.id, "active", v)} />
            </div>
          </div>
        </Card>
      ))}

      {/* Preview */}
      <Card>
        <div style={{ fontSize:10, color:"#475569", marginBottom:10, letterSpacing:2 }}>معاينة الـ Footer</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
          {socials.filter(s => s.active).map(s => (
            <a key={s.id} href={s.url || "#"} target="_blank" rel="noreferrer" style={{
              display:"flex", alignItems:"center", gap:6, padding:"5px 10px",
              borderRadius:5, background:"#1e293b", border:"1px solid #334155",
              color:"#94a3b8", fontSize:11, textDecoration:"none",
            }}>
              <span style={{ fontSize:13 }}>{s.icon}</span>
              <span>{s.handle}</span>
            </a>
          ))}
        </div>
      </Card>

      <button onClick={async () => { await new Promise(r=>setTimeout(r,700)); setSaved(true); setTimeout(()=>setSaved(false),3000); }} style={{ padding:"12px 0", borderRadius:8, border:"none", background:saved?"#14532d":"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", fontSize:13, fontWeight:700, fontFamily:"inherit", cursor:"pointer" }}>
        {saved ? "✅ تم حفظ وسائل التواصل" : "💾 حفظ التغييرات"}
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SECTION 6: بيانات الشركة والعلامة التجارية ← جديد
// ──────────────────────────────────────────────────────────────
function CompanySection() {
  const [co, setCo] = useState(DEFAULT_COMPANY);
  const [saved, setSaved] = useState(false);
  const upd = (k, v) => setCo(prev => ({...prev, [k]: v}));

  const group = (title, icon, fields) => (
    <Card key={title}>
      <div style={{ fontSize:11, color:"#64748b", marginBottom:14, fontWeight:700, display:"flex", alignItems:"center", gap:8 }}>
        <span>{icon}</span> {title}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {fields.map(([k, l, mono=false]) => (
          <Input key={k} label={l} value={co[k]} onChange={v => upd(k, v)} mono={mono} />
        ))}
      </div>
    </Card>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

      <Card>
        <div style={{ fontSize:11, color:"#64748b", marginBottom:4 }}>
          هذه البيانات تظهر في الـ Landing Page وفي الفواتير فقط — وفق متطلبات هيئة الزكاة والضريبة والجمارك السعودية (ZATCA فاز ٢)
        </div>
      </Card>

      {group("بيانات المنصة والعلامة التجارية", "🌍", [
        ["platform_name_en",   "اسم المنصة (إنجليزي)"],
        ["platform_name_ar",   "اسم المنصة (عربي)"],
        ["platform_tagline_ar","الشعار التعريفي (عربي)"],
        ["platform_tagline_en","الشعار التعريفي (إنجليزي)"],
        ["platform_url",       "رابط المنصة", true],
        ["platform_email",     "البريد الإلكتروني"],
        ["platform_phone",     "رقم الهاتف"],
      ])}

      {group("بيانات الشركة القانونية", "🏢", [
        ["company_name_ar",   "اسم الشركة (عربي)"],
        ["company_name_en",   "اسم الشركة (إنجليزي)"],
        ["commercial_register","رقم السجل التجاري", true],
        ["vat_number",         "الرقم الضريبي (15 رقماً)", true],
        ["unified_number",     "الرقم الموحد", true],
      ])}

      {group("العنوان والموقع", "📍", [
        ["address_ar",  "العنوان (عربي)"],
        ["address_en",  "العنوان (إنجليزي)"],
        ["zip_code",    "الرمز البريدي", true],
      ])}

      {group("البيانات البنكية (للفواتير)", "🏦", [
        ["bank_name", "اسم البنك"],
        ["iban",      "رقم IBAN", true],
        ["currency",  "العملة"],
        ["vat_rate",  "نسبة ضريبة القيمة المضافة (%)"],
      ])}

      {/* Legal options */}
      <Card>
        <div style={{ fontSize:11, color:"#64748b", marginBottom:14, fontWeight:700 }}>⚖️ الاشتراطات القانونية للفواتير (ZATCA)</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[
            { k:"show_vat_on_invoice", l:"إظهار الرقم الضريبي في الفواتير", d:"إلزامي وفق ZATCA فاز 2" },
            { k:"show_cr_on_invoice",  l:"إظهار السجل التجاري في الفواتير", d:"مطلوب في الفواتير الرسمية" },
          ].map(opt => (
            <div key={opt.k} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#060d18", borderRadius:8, padding:"10px 14px", border:"1px solid #1e293b" }}>
              <div>
                <div style={{ fontSize:12, color:"#e2e8f0", fontWeight:600 }}>{opt.l}</div>
                <div style={{ fontSize:10, color:"#475569" }}>{opt.d}</div>
              </div>
              <Toggle value={co[opt.k]} onChange={v => upd(opt.k, v)} />
            </div>
          ))}
        </div>
        <div style={{ marginTop:12, display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={{ fontSize:10, color:"#475569", display:"block", marginBottom:6 }}>بادئة رقم الفاتورة</label>
            <input value={co.invoice_prefix} onChange={e => upd("invoice_prefix", e.target.value)} style={{ width:"100%", background:"#060d18", border:"1px solid #1e293b", borderRadius:5, padding:"8px 12px", color:"#f8fafc", fontSize:12, fontFamily:"'Courier New',monospace", direction:"ltr" }} />
            <div style={{ fontSize:9, color:"#334155", marginTop:3 }}>مثال: {co.invoice_prefix}-2026-0001</div>
          </div>
          <div>
            <label style={{ fontSize:10, color:"#475569", display:"block", marginBottom:6 }}>مرحلة ZATCA المفعّلة</label>
            <select value={co.zatca_phase} onChange={e => upd("zatca_phase", e.target.value)} style={{ width:"100%", background:"#060d18", border:"1px solid #1e293b", borderRadius:5, padding:"8px 12px", color:"#f8fafc", fontSize:12, fontFamily:"inherit" }}>
              <option value="1">الفاز الأول (E-Invoicing أساسي)</option>
              <option value="2">الفاز الثاني (ربط منظومة ZATCA)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Preview landing info */}
      <Card>
        <div style={{ fontSize:10, color:"#475569", marginBottom:10, letterSpacing:2 }}>معاينة ما يظهر في Landing Page</div>
        <div style={{ background:"#060d18", border:"1px solid #1e293b", borderRadius:6, padding:14 }}>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:"#22c55e" }}>{co.platform_name_en}<span style={{ color:"#f8fafc" }}></span></div>
              <div style={{ fontSize:11, color:"#64748b" }}>{co.platform_tagline_ar}</div>
            </div>
            <div style={{ flex:1 }} />
            <div style={{ textAlign:"left", direction:"ltr" }}>
              <div style={{ fontSize:11, color:"#94a3b8" }}>📧 {co.platform_email}</div>
              <div style={{ fontSize:11, color:"#94a3b8" }}>📞 {co.platform_phone}</div>
              <div style={{ fontSize:11, color:"#94a3b8" }}>🌐 {co.platform_url}</div>
            </div>
          </div>
          <div style={{ borderTop:"1px solid #1e293b", marginTop:10, paddingTop:10, display:"flex", gap:20, flexWrap:"wrap" }}>
            <div style={{ fontSize:10, color:"#334155" }}>© 2026 {co.company_name_ar}</div>
            {co.show_cr_on_invoice && <div style={{ fontSize:10, color:"#334155" }}>س.ت: {co.commercial_register}</div>}
            {co.show_vat_on_invoice && <div style={{ fontSize:10, color:"#334155" }}>الرقم الضريبي: {co.vat_number}</div>}
            <div style={{ fontSize:10, color:"#334155" }}>الرياض — المملكة العربية السعودية</div>
          </div>
        </div>
      </Card>

      <button onClick={async () => { await new Promise(r=>setTimeout(r,700)); setSaved(true); setTimeout(()=>setSaved(false),3000); }} style={{ padding:"12px 0", borderRadius:8, border:"none", background:saved?"#14532d":"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", fontSize:13, fontWeight:700, fontFamily:"inherit", cursor:"pointer" }}>
        {saved ? "✅ تم حفظ بيانات الشركة" : "💾 حفظ جميع البيانات"}
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// NEW: Users Management Section
// ──────────────────────────────────────────────────────────────
function UsersSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    fetch("/api/admin/users").then(r => r.json()).then(d => {
      setUsers(d.users || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const filtered = users.filter(u => {
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchSearch = !search || (u.email || "").includes(search) || (u.full_name || "").includes(search);
    return matchRole && matchSearch;
  });

  const stats = {
    total: users.length,
    free: users.filter(u => u.role === "free" || !u.role).length,
    pro: users.filter(u => u.role === "pro").length,
    admin: users.filter(u => u.role === "admin").length,
  };

  if (loading) return <div style={{ padding:32, textAlign:"center", color:"#22c55e" }}>جارٍ تحميل المستخدمين...</div>;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
        {[
          { label:"إجمالي", val:stats.total, color:"#3b82f6" },
          { label:"مجاني", val:stats.free, color:"#64748b" },
          { label:"خبير PRO", val:stats.pro, color:"#22c55e" },
          { label:"أدمن", val:stats.admin, color:"#f59e0b" },
        ].map(s => (
          <div key={s.label} style={{ background:"#0a1628", border:"1px solid #1e293b", borderRadius:8, padding:"14px", textAlign:"center" }}>
            <div style={{ fontSize:9, color:"#475569" }}>{s.label}</div>
            <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 بحث بالبريد أو الاسم..." style={{ background:"#0a1628", border:"1px solid #1e293b", borderRadius:6, padding:"8px 12px", color:"#e2e8f0", fontSize:11, fontFamily:"inherit", outline:"none", flex:1 }} />
        {["all","free","pro","admin"].map(r => (
          <button key={r} onClick={() => setFilterRole(r)} style={{ padding:"6px 12px", borderRadius:5, fontSize:10, fontWeight:600, cursor:"pointer", fontFamily:"inherit", border:"1px solid", background:filterRole===r?"#22c55e22":"#0a1628", borderColor:filterRole===r?"#22c55e":"#1e293b", color:filterRole===r?"#22c55e":"#64748b" }}>
            {r==="all"?"الكل":r==="free"?"مجاني":r==="pro"?"خبير":"أدمن"}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div style={{ background:"#0a1628", border:"1px solid #1e293b", borderRadius:8, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 120px 80px 100px 100px", padding:"10px 14px", background:"#080f1c", borderBottom:"1px solid #1e293b", fontSize:10, color:"#475569", fontWeight:600 }}>
          <span>البريد / الاسم</span><span style={{ textAlign:"center" }}>الاسم</span><span style={{ textAlign:"center" }}>الدور</span><span style={{ textAlign:"center" }}>التسجيل</span><span style={{ textAlign:"center" }}>إجراءات</span>
        </div>
        {filtered.map(u => (
          <div key={u.id} style={{ display:"grid", gridTemplateColumns:"1fr 120px 80px 100px 100px", padding:"10px 14px", borderBottom:"1px solid #0f1829", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:11, fontWeight:600, color:"#e2e8f0" }}>{u.email}</div>
            </div>
            <div style={{ fontSize:10, color:"#94a3b8", textAlign:"center" }}>{u.full_name || "—"}</div>
            <div style={{ textAlign:"center" }}>
              <span style={{ fontSize:9, padding:"2px 8px", borderRadius:3, fontWeight:700, background:u.role==="admin"?"#f59e0b22":u.role==="pro"?"#22c55e22":"#1e293b", color:u.role==="admin"?"#f59e0b":u.role==="pro"?"#22c55e":"#64748b" }}>
                {u.role==="admin"?"أدمن":u.role==="pro"?"خبير":"مجاني"}
              </span>
            </div>
            <div style={{ fontSize:9, color:"#475569", textAlign:"center" }}>{u.created_at ? new Date(u.created_at).toLocaleDateString("ar-SA") : "—"}</div>
            <div style={{ textAlign:"center" }}>
              <select value={u.role || "free"} onChange={e => handleRoleChange(u.id, e.target.value)} style={{ background:"#0f1829", border:"1px solid #1e293b", borderRadius:4, padding:"3px 6px", color:"#e2e8f0", fontSize:10, cursor:"pointer" }}>
                <option value="free">مجاني</option>
                <option value="pro">خبير</option>
                <option value="admin">أدمن</option>
              </select>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding:20, textAlign:"center", color:"#475569", fontSize:11 }}>لا توجد نتائج</div>}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// NEW: Pricing Management Section
// ──────────────────────────────────────────────────────────────
function PricingSection() {
  const [pricing, setPricing] = useState({
    free: { price:0, ai_limit:3, features:["الخريطة الأساسية","3 تحليلات AI/يوم","14 تبويب مجاني"] },
    pro: { price:49, ai_limit:-1, features:["تحليلات AI غير محدودة","غرفة عمليات كاملة","تنبيهات DEFCON فورية","تقارير PDF"] },
    enterprise: { price:299, ai_limit:-1, features:["API بيانات كاملة","5 مستخدمين","دعم فني 24/7","تقارير مخصصة"] },
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/pricing").then(r => r.json()).then(d => {
      if (d.pricing) setPricing(d.pricing);
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/pricing", {
      method: "PATCH",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ pricing }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const planColors = { free:"#64748b", pro:"#22c55e", enterprise:"#f59e0b" };
  const planNames = { free:"مجاني", pro:"خبير PRO", enterprise:"مؤسسي" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {Object.entries(pricing).map(([key, plan]) => (
          <div key={key} style={{ background:"#0a1628", border:`1px solid ${planColors[key]}44`, borderRadius:12, padding:20 }}>
            <div style={{ fontSize:14, fontWeight:800, color:planColors[key], marginBottom:12 }}>{planNames[key]}</div>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:10, color:"#475569", display:"block", marginBottom:4 }}>السعر ($/شهر)</label>
              <input type="number" value={plan.price} onChange={e => setPricing(p => ({ ...p, [key]:{ ...p[key], price:parseInt(e.target.value)||0 } }))} style={{ width:"100%", background:"#0f1829", border:"1px solid #1e293b", borderRadius:6, padding:"8px 10px", color:"#f8fafc", fontSize:18, fontWeight:700, textAlign:"center" }} />
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:10, color:"#475569", display:"block", marginBottom:4 }}>حد AI يومي (-1 = غير محدود)</label>
              <input type="number" value={plan.ai_limit} onChange={e => setPricing(p => ({ ...p, [key]:{ ...p[key], ai_limit:parseInt(e.target.value) } }))} style={{ width:"100%", background:"#0f1829", border:"1px solid #1e293b", borderRadius:6, padding:"6px 10px", color:"#e2e8f0", fontSize:12, textAlign:"center" }} />
            </div>
            <div>
              <label style={{ fontSize:10, color:"#475569", display:"block", marginBottom:4 }}>الميزات (سطر لكل ميزة)</label>
              <textarea value={(plan.features||[]).join("\n")} onChange={e => setPricing(p => ({ ...p, [key]:{ ...p[key], features:e.target.value.split("\n").filter(Boolean) } }))} rows={4} style={{ width:"100%", background:"#0f1829", border:"1px solid #1e293b", borderRadius:6, padding:"6px 10px", color:"#e2e8f0", fontSize:10, resize:"vertical", lineHeight:1.8 }} />
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving} style={{ padding:"12px 0", borderRadius:8, border:"none", background:saved?"#14532d":"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", fontSize:13, fontWeight:700, fontFamily:"inherit", cursor:"pointer", opacity:saving?0.6:1 }}>
        {saving?"جارٍ الحفظ...":saved?"✅ تم حفظ الأسعار":"💾 حفظ تعديلات الأسعار"}
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// NEW: Analytics Dashboard Section
// ──────────────────────────────────────────────────────────────
function AnalyticsSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics").then(r => r.json()).then(d => {
      setData(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding:32, textAlign:"center", color:"#22c55e" }}>جارٍ تحميل الإحصائيات...</div>;
  if (!data) return <div style={{ padding:32, textAlign:"center", color:"#ef4444" }}>تعذّر تحميل البيانات</div>;

  const cards = [
    { label:"إجمالي المشتركين", val:data.subscribers || 0, icon:"📧", color:"#22c55e" },
    { label:"المستخدمين المسجلين", val:data.users || 0, icon:"👥", color:"#3b82f6" },
    { label:"التقارير المرسلة", val:data.reports || 0, icon:"📋", color:"#f59e0b" },
    { label:"تنبيهات DEFCON", val:data.alerts || 0, icon:"🚨", color:"#ef4444" },
    { label:"إيميلات مرسلة", val:data.emailsSent || 0, icon:"✉️", color:"#8b5cf6" },
    { label:"استخدام AI اليوم", val:data.aiUsesToday || 0, icon:"🤖", color:"#0ea5e9" },
  ];

  const maxVal = Math.max(...cards.map(c => c.val), 1);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Stats Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        {cards.map(c => (
          <div key={c.label} style={{ background:"#0a1628", border:"1px solid #1e293b", borderRadius:10, padding:"16px 14px", textAlign:"center" }}>
            <div style={{ fontSize:24, marginBottom:6 }}>{c.icon}</div>
            <div style={{ fontSize:9, color:"#475569", marginBottom:4 }}>{c.label}</div>
            <div style={{ fontSize:28, fontWeight:900, color:c.color }}>{c.val.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div style={{ background:"#0a1628", border:"1px solid #1e293b", borderRadius:10, padding:20 }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#f8fafc", marginBottom:16 }}>📊 نظرة عامة</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {cards.map(c => (
            <div key={c.label} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:120, fontSize:10, color:"#94a3b8", textAlign:"right", flexShrink:0 }}>{c.label}</div>
              <div style={{ flex:1, background:"#1e293b", borderRadius:4, height:20, overflow:"hidden" }}>
                <div style={{ width:Math.max((c.val/maxVal)*100, 2)+"%", height:"100%", background:c.color, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"flex-end", paddingLeft:6 }}>
                  <span style={{ fontSize:9, color:"#fff", fontWeight:700 }}>{c.val.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// MAIN ADMIN DASHBOARD
// ──────────────────────────────────────────────────────────────
const SECTIONS = [
  { id:"review",    icon:"📋", label:"مراجعة التقرير",         badge:"مسودة",    bc:"#f59e0b", comp:ReviewSection   },
  { id:"settings",  icon:"⚙️", label:"الإعدادات",              badge:null,       bc:null,      comp:SettingsSection  },
  { id:"archive",   icon:"📚", label:"الأرشيف",                badge:"3 ملفات",  bc:"#22c55e", comp:ArchiveSection   },
  { id:"templates", icon:"✉️", label:"قوالب الإيميل",          badge:"3",        bc:"#3b82f6", comp:TemplatesSection },
  { id:"social",    icon:"🔗", label:"وسائل التواصل",          badge:"8 منصات",  bc:"#8b5cf6", comp:SocialSection    },
  { id:"company",   icon:"🏢", label:"بيانات الشركة",          badge:"ZATCA",    bc:"#f59e0b", comp:CompanySection   },
  { id:"users",     icon:"👥", label:"إدارة المستخدمين",       badge:"جديد",     bc:"#ef4444", comp:UsersSection     },
  { id:"pricing",   icon:"💰", label:"إدارة الأسعار",          badge:null,       bc:null,      comp:PricingSection   },
  { id:"analytics", icon:"📈", label:"لوحة الإحصائيات",        badge:null,       bc:null,      comp:AnalyticsSection },
  { id:"editorial", icon:"📅", label:"الجدول التحريري",        badge:"جديد",     bc:"#22c55e", comp:EditorialCalendar },
  { id:"polls",     icon:"📊", label:"إدارة الاستطلاعات",      badge:"جديد",     bc:"#0ea5e9", comp:PollManager       },
  { id:"comments",  icon:"💬", label:"إدارة التعليقات",        badge:"جديد",     bc:"#f97316", comp:CommentModeration },
  { id:"team",      icon:"🧑‍💼", label:"فريق العمل",            badge:"جديد",     bc:"#ec4899", comp:TeamManager       },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("review");

  const sec = SECTIONS.find(s => s.id === active);
  const Comp = sec.comp;

  return (
    <div style={{ fontFamily:"'IBM Plex Sans Arabic','Tajawal',sans-serif", background:"#060d18", minHeight:"100vh", color:"#e2e8f0", direction:"rtl", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:#1e293b; border-radius:2px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation:fadeIn 0.25s ease; }
        input,select,textarea { font-family:'IBM Plex Sans Arabic','Tajawal',sans-serif !important; }
        input:focus,select:focus,textarea:focus { outline:1px solid #22c55e55; }
      `}</style>



      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {/* Sidebar */}
        <div style={{ width:210, flexShrink:0, background:"#080f1c", borderLeft:"1px solid #1e293b", padding:"12px 8px", display:"flex", flexDirection:"column", gap:3 }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)} style={{ width:"100%", padding:"10px 12px", borderRadius:8, background:active===s.id?"#1e3a5f":"transparent", border:`1px solid ${active===s.id?"#3b82f6":"transparent"}`, color:active===s.id?"#93c5fd":"#64748b", fontSize:12, fontWeight:active===s.id?700:400, fontFamily:"inherit", cursor:"pointer", display:"flex", alignItems:"center", gap:8, textAlign:"right", transition:"all 0.2s" }}>
              <span style={{ fontSize:15 }}>{s.icon}</span>
              <span style={{ flex:1 }}>{s.label}</span>
              {s.badge && (
                <span style={{ background:s.bc+"22", color:s.bc, border:`1px solid ${s.bc}44`, padding:"1px 6px", borderRadius:4, fontSize:8, fontWeight:700 }}>{s.badge}</span>
              )}
            </button>
          ))}
          <div style={{ marginTop:"auto", paddingTop:12, borderTop:"1px solid #1e293b" }}>
            <button style={{ width:"100%", padding:"8px 12px", borderRadius:8, background:"transparent", border:"1px solid #1e293b", color:"#475569", fontSize:11, fontFamily:"inherit", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
              <span>🌍</span> العودة للموقع
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflow:"auto", padding:20 }}>
          <div style={{ marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:18 }}>{sec.icon}</span>
            <span style={{ fontSize:16, fontWeight:800, color:"#f8fafc" }}>{sec.label}</span>
          </div>
          <div className="fade-in" key={active}><Comp /></div>
        </div>
      </div>
    </div>
  );
}
