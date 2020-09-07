## The problem

The problem consists in rendering events on a calendar, avoiding overlapping events to visually overlap.
Your implementation should meet the two following constraints:

* Every overlapping event should have the same width as every event it overlaps
* Every event should use the maximum width available

A visual illustration of the problem is given below.

Rendering events on a calendar means here: the relative position of events to the top of the screen and their height is a function of the height of the screen, the start/end time of the calendar, and the start time/duration of the events. For example: if the calendar goes from 00:00 to 24:00 and the screen is 2400px high, an event starting at 12:00 and lasting 1h would be positioned at 1200px of the top of the screen and have a height of 100px.

## The input

The input (available below) is an array of events occurring on the same date. They have the following structure:

```javascript
{
  id: 1,
  start: '15:00', // The event starts at 03:00 pm
  duration: 90 // The duration is expressed in minutes
}
```

## The output

Your code should render the events on a webpage in a container spanning the whole window.
The top of the page represents 09:00 am. The bottom of the page represents 09:00 pm.

The events should be represented as a `div` with a background color and a 1px border. The `div` should display the event's `id`.

Your implementation should be responsive (i.e. respond to window `resize` events).

## My solution

1) We need to convert "string-format date" to corresponding 'height number date' depending on size of the screen.
2) We need to calculate all colission for a current event
3) In each event, we loop through colision event and check start and ending date. if there is no colission, the final width will be full-size.
4) We apply conditional statement to determine overlaping. They will change the left position of events
5) Finally, we draw events with the width and the left position previously set

## Dependencies

You may use React, any lightweight templating library, or vanilla JS to do the rendering. You may use helper libraries such as lodash, etc. if you wish to. Javascript can be written in ES6.

The easiest way to share your code is a [sandbox](https://codesandbox.io/). If you wish to go with React, you may share a project created with [create-react-app](https://github.com/facebook/create-react-app), preferably on github.

## Browser support

Your code should run in major modern browsers.

## Evaluation

Our evaluation criteria are:

* the correctness of the algorithm
* the readability of the code (code structure, variables naming, comments,…)

## Visual illustration of the problem

**1 event**

```
┌────────────┐
|            |
└────────────┘
```

**2 events**

```
┌─────┐┌─────┐
|     |└─────┘
└─────┘
```

**3 events where events 1, 2 and 3 overlap, but events 1 and 3 do not**

```
┌─────┐
|  1  |┌─────┐
└─────┘|     |
       |  2  |
┌─────┐|     |
|  3  |└─────┘
└─────┘
```

The configuration above meets all constraints. Be careful, something like below would not meet constraint 2 :

```
┌───┐
| 1 |┌───┐
└───┘|   |
     | 2 |
     |   |┌───┐
     └───┘| 3 |
          └───┘
```

**If we combine cases 1, 2 and 3, you should end up with something like**

*The schema below assumes the width of event 1 equals the width of the window.*

```
┌────────────┐
|     1      |
└────────────┘

┌─────┐┌─────┐
|     ||  3  |
|  2  |└─────┘
|     |
└─────┘

┌─────┐
|  4  |┌─────┐
└─────┘|     |
       |  5  |
┌─────┐|     |
|  6  |└─────┘
└─────┘
```