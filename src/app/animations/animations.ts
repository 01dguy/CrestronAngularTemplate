// Import necessary functions from Angular animations module
import { transition, style, animate, trigger } from '@angular/animations';

// Pop-up animations
const enterTransition = transition(':enter', [
  // Initially, the element is fully transparent (opacity: 0)
  style({
    opacity: 0,
  }),
  // Over 0.5 seconds, animate the element to be fully opaque (opacity: 1)
  animate(
    '0.5s ease-in',
    style({
      opacity: 1,
    })
  ),
]);

const leaveTransition = transition(':leave', [
  // Initially, the element is fully opaque (opacity: 1)
  style({
    opacity: 1,
  }),
  // Over 0.5 seconds, animate the element to be fully transparent (opacity: 0)
  animate(
    '0.5s ease-out',
    style({
      opacity: 0,
    })
  ),
]);

// Page flip animations
const pageInTransition = transition(':enter', [
  // Initially, the element is fully transparent (opacity: 0)
  style({
    opacity: 0,
  }),
  // Over 0.2 seconds, animate the element to be fully opaque (opacity: 1)
  animate(
    '0.3s ease-in',
    style({
      opacity: 1,
    })
  ),
]);

const pageOutTransition = transition(':leave', [
  // Initially, the element is fully opaque (opacity: 1)
  style({
    opacity: 1,
  }),
  // Over 0.2 seconds, animate the element to be fully transparent (opacity: 0)
  animate(
    '0.3s ease-out',
    style({
      opacity: 0,
    })
  ),
]);

// Combined fadeInOut trigger for modal popups and similar use
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

// Export the animations, associating each with a trigger
// 'fadeIn' will trigger the enter transition, and 'fadeOut' will trigger the leave transition
export const FadeInOutAnimation = [
  trigger('fadeIn', [enterTransition]),
  trigger('fadeOut', [leaveTransition]),
  trigger('pageIn', [pageInTransition]),
  trigger('pageOut', [pageOutTransition]),
  fadeInOut,
];