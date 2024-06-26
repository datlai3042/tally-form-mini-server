import {
      generateInputSettingDefault,
      inputSettingEmail,
      inputSettingOption,
      inputSettingPhone,
      inputSettingText,
      inputSettingVote
} from '~/constants/input.constants'
import { Core, Form, InputCore } from '~/type'

export const generateInputSettingWithType = (type: InputCore.InputForm['type'], form: Form.FormCore, inputItem: InputCore.InputForm) => {
      let core = {} as Core.CoreCommon

      switch (type) {
            case 'TEXT': {
                  const setting_default = generateInputSettingDefault(form, inputItem)
                  return (core = { setting: { ...setting_default, ...inputSettingText } } as Core.Text)
            }

            case 'EMAIL': {
                  const setting_default = generateInputSettingDefault(form, inputItem)
                  return (core = { setting: { ...setting_default, ...inputSettingEmail } } as Core.Text)
            }

            case 'VOTE': {
                  const setting_default = generateInputSettingDefault(form, inputItem)
                  return (core = { setting: { ...setting_default, ...inputSettingVote } } as Core.Text)
            }

            case 'PHONE': {
                  const setting_default = generateInputSettingDefault(form, inputItem)
                  return (core = { setting: { ...setting_default, ...inputSettingPhone } } as Core.Text)
            }

            case 'TEXT': {
                  const setting_default = generateInputSettingDefault(form, inputItem)
                  return (core = { setting: { ...setting_default, ...inputSettingText } } as Core.Text)
            }

            case 'OPTION': {
                  const setting_default = generateInputSettingDefault(form, inputItem)
                  return (core = { setting: { ...setting_default, ...inputSettingOption }, options: [] } as Core.Option)
            }

            case 'OPTION_MULTIPLE': {
                  const setting_default = generateInputSettingDefault(form, inputItem)
                  return (core = { setting: { ...setting_default, ...inputSettingOption }, options: [] } as Core.Option)
            }
      }

      return core
}
