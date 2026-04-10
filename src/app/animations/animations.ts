import { transition, style, animate, trigger } from '@angular/animations';

// Shared enter/leave fades for popups and page regions.
const enterTransition = transition(':enter', [
  style({
    opacity: 0,
  }),
  animate(
    '0.5s ease-in',
    style({
      opacity: 1,
    })
  ),
]);

const leaveTransition = transition(':leave', [
  style({
    opacity: 1,
  }),
  animate(
    '0.5s ease-out',
    style({
      opacity: 0,
    })
  ),
]);

// Slightly faster transitions used for page containers.
const pageInTransition = transition(':enter', [
  style({
    opacity: 0,
  }),
  animate(
    '0.3s ease-in',
    style({
      opacity: 1,
    })
  ),
]);

const pageOutTransition = transition(':leave', [
  style({
    opacity: 1,
  }),
  animate(
    '0.3s ease-out',
    style({
      opacity: 0,
    })
  ),
]);

// Single trigger variant used by components that prefer one animation binding.
export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('0.3s ease-in', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('0.3s ease-out', style({ opacity: 0 }))
  ])
]);

// Exported as an array for easy reuse in component metadata.
export const FadeInOutAnimation = [
  trigger('fadeIn', [enterTransition]),
  trigger('fadeOut', [leaveTransition]),
  trigger('pageIn', [pageInTransition]),
  trigger('pageOut', [pageOutTransition]),
  fadeInOut,
];
