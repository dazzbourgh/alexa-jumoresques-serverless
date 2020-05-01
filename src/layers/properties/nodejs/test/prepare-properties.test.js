"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_test_json_1 = __importDefault(require("./env.test.json"));
// import invalidProps from './env.invalid.json'
const env_expected_json_1 = __importDefault(require("./env.expected.json"));
const properties_1 = require("../src/properties");
const common_1 = require("common");
describe('properties preparing function', () => {
    test('should replace $ values with environment variables', async () => {
        const secretsManager = {
            getSecretValue: jest.fn(() => common_1.promise({
                SecretString: `{
          "token": "${env_expected_json_1.default.vk.token}"
        }`
            }))
        };
        await expect(properties_1.assembleProperties('test', secretsManager, process.env.FUNCTION_NAME)(env_test_json_1.default))
            .resolves.toEqual(env_expected_json_1.default);
    });
    // test('should fail if neither env variable nor default value provided', async () => {
    //   await expect(prepare(invalidProps)).rejects.toEqual(new Error('Environment variable or default value expected for field: missingEnvVar'))
    // })
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcGFyZS1wcm9wZXJ0aWVzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJ0ZXN0L3ByZXBhcmUtcHJvcGVydGllcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQW1DO0FBQ25DLGdEQUFnRDtBQUNoRCw0RUFBK0M7QUFDL0Msa0RBQXNEO0FBRXRELG1DQUFnQztBQUVoQyxRQUFRLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO0lBQzdDLElBQUksQ0FBQyxvREFBb0QsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNwRSxNQUFNLGNBQWMsR0FBRztZQUNyQixjQUFjLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxnQkFBTyxDQUFDO2dCQUNwQyxZQUFZLEVBQUU7c0JBQ0EsMkJBQWEsQ0FBQyxFQUFFLENBQUMsS0FBSztVQUNsQzthQUNILENBQUMsQ0FBQztTQUM2QixDQUFBO1FBQ2xDLE1BQU0sTUFBTSxDQUFDLCtCQUFrQixDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUF1QixDQUFDLENBQUMsdUJBQUssQ0FBQyxDQUFDO2FBQ2pHLFFBQVEsQ0FBQyxPQUFPLENBQUMsMkJBQWEsQ0FBQyxDQUFBO0lBQ3BDLENBQUMsQ0FBQyxDQUFBO0lBRUYsdUZBQXVGO0lBQ3ZGLDhJQUE4STtJQUM5SSxLQUFLO0FBQ1AsQ0FBQyxDQUFDLENBQUEifQ==