## Installation

````javascript
import * as ET from 'express-toolbox'
````



## Usage

````javascript
router.get('/', ET.try$(async (req, res, next) => {
  ...
}))
````



````javascript
ET.hang(router).until(async () => {
	await initializeDatabase()
	await ....
})
````

