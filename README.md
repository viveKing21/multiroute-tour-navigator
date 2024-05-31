# MultiRoute Tour Navigator

MultiRoute Tour Navigator is a React component that extends the functionality of Tour Navigator by providing the ability to create multi-route tours for React websites. It utilizes react-router-dom for navigation between routes and requires Tour Navigator to be installed alongside this package.

## Installation

To use MultiRoute Tour Navigator, make sure you have `react-router-dom` and `tour-navigator` installed in your project:

```bash
npm install react-router-dom tour-navigator multiroute-tour-navigator
# or
yarn add react-router-dom tour-navigator multiroute-tour-navigator
```

## Usage
Import MultiRouteTour from multiroute-tour-navigator and use it in your React components to define multi-route tours.
```javascript
import { MultiRouteTour } from 'multiroute-tour-navigator';
import { useHistory } from 'react-router-dom';

const MyComponent = () => {
  const history = useHistory();

  return (
    <MultiRouteTour
      id="my-tour"
      steps={[ /* Array of steps */ ]}
      nextStepRoute="/about"
      nextStepCount={4}
      number={1}
    />
  );
};
```
## Props
`MultiRouteTour` component accepts props similar to TourNavigator, along with additional props specific to multi-route tours:

| Prop               | Type    | Description                                                                                        |
|--------------------|---------|----------------------------------------------------------------------------------------------------|
| nextStepCount      | number  | Number of steps after transitioning to the next route.                                             |
| nextStepRoute      | string  | Route to navigate to after completing the current tour on this route.                              |
| number             | number  | Number representing the current route in the multi-route tour. If not provided, it will automatically take the next route in sequence. |
| replace            | boolean | Whether to replace the current route in history while navigating. Default: false.                 |
| ...                | -       | Other props from TourNavigatorProps                                                                |

## License

This project is licensed under the [MIT](LICENSE).
