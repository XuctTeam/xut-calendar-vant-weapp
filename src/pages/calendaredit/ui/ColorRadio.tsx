/*
 * @Description:
 * @Author: Derek Xu
 * @Date: 2021-12-13 10:03:33
 * @LastEditTime: 2022-11-08 09:53:04
 * @LastEditors: Derek Xu
 */
import { FunctionComponent } from 'react'
import { colors } from '@/calendar/constants/index'
import { RadioGroup, Grid, GridItem, Radio } from '@antmjs/vantui'

interface IColorPropState {
  defaultColor: string
  onChage: (value: string) => void
}

const ColorRadio: FunctionComponent<IColorPropState> = (props) => {
  return (
    <RadioGroup value={props.defaultColor} onChange={(e) => props.onChage(e.detail)}>
      <Grid border={false} columnNum={5}>
        {colors.map((c, i) => {
          return (
            <GridItem key={i}>
              <Radio key={i} name={c.value} checkedColor={`#${c.value}`} iconSize='26px'></Radio>
            </GridItem>
          )
        })}
      </Grid>
    </RadioGroup>
  )
}
export default ColorRadio
