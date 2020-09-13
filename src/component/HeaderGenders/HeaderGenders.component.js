import { PureComponent } from 'react';

import GenderButton from 'Component/GenderButton';

import './HeaderGenders.style';

class HeaderGenders extends PureComponent {
    genderList = [
        {
            label: __('Men'),
            key: 'men'
        },
        {
            label: __('Women'),
            key: 'women'
        },
        {
            label: __('Kids'),
            key: 'kids'
        }
    ];

    renderGender = (gender) => {
        const { key } = gender;

        return (
            <GenderButton
              key={ key }
              gender={ gender }
              mix={ {
                  block: 'HeaderGenders',
                  elem: 'Button'
              } }
            />
        );
    };

    renderGenders() {
        return this.genderList.map(this.renderGender);
    }

    render() {
        return (
            <div block="HeaderGenders">
                { this.renderGenders() }
            </div>
        );
    }
}

export default HeaderGenders;
