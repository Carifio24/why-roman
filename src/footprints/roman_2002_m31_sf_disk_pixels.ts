import type { Point } from "./types";
import { corners } from "./roman_2002_m31_sf_disk";

const chip = corners[14];
const N_PIXELS_SIDE = 4096;

const minRA = 11.1;
const maxRA = 11.3;
const minDec = 41.5;
const maxDec = 41.7;

const lines = new LineList();
