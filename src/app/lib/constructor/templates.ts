// Copyright 2017 The gachain-front Authors
// This file is part of the gachain-front library.
//
// The gachain-front library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The gachain-front library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the gachain-front library. If not, see <http://www.gnu.org/licenses/>.

import { copyObject, idGenerator, setIds } from 'lib/constructor';

const constructorTemplates: any = {
    'formWithHeader': {
        tag: 'div',
        attr: {
            'class': 'panel panel-primary'
        },
        children: [
            {
                tag: 'div',
                attr: {
                    'class': 'panel-heading'
                },
                children: [
                    {
                        tag: 'text',
                        text: 'Money transfer'
                    }
                ]
            },
            {
                tag: 'form',
                children: [
                    {
                        tag: 'div',
                        attr: {
                            'class': 'list-group-item'
                        },
                        children: [
                            {
                                tag: 'div',
                                attr: {
                                    'class': 'row df f-valign'
                                },
                                children: [
                                    {
                                        tag: 'div',
                                        attr: {
                                            'class': 'col-md-3 mt-sm text-right'
                                        },
                                        children: [
                                            {
                                                tag: 'label',
                                                children: [
                                                    {
                                                        tag: 'text',
                                                        text: 'Input1'
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        tag: 'div',
                                        attr: {
                                            'class': 'col-md-9 mc-sm text-left'
                                        },
                                        children: [
                                            {
                                                tag: 'input',
                                                attr: {
                                                    class: 'form-control',
                                                    name: 'Input3',
                                                    type: 'text'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tag: 'div',
                        attr: {
                            'class': 'list-group-item'
                        },
                        children: [
                            {
                                tag: 'div',
                                attr: {
                                    'class': 'row df f-valign'
                                },
                                children: [
                                    {
                                        tag: 'div',
                                        attr: {
                                            'class': 'col-md-3 mt-sm text-right'
                                        },
                                        children: [
                                            {
                                                tag: 'label',
                                                children: [
                                                    {
                                                        tag: 'text',
                                                        text: 'Input2'
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        tag: 'div',
                                        attr: {
                                            'class': 'col-md-9 mc-sm text-left'
                                        },
                                        children: [
                                            {
                                                tag: 'input',
                                                attr: {
                                                    class: 'form-control',
                                                    name: 'Input3',
                                                    type: 'text'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tag: 'div',
                        attr: {
                            'class': 'list-group-item'
                        },
                        children: [
                            {
                                tag: 'div',
                                attr: {
                                    'class': 'row df f-valign'
                                },
                                children: [
                                    {
                                        tag: 'div',
                                        attr: {
                                            'class': 'col-md-3 mt-sm text-right'
                                        },
                                        children: [
                                            {
                                                tag: 'label',
                                                children: [
                                                    {
                                                        tag: 'text',
                                                        text: 'Input3'
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        tag: 'div',
                                        attr: {
                                            'class': 'col-md-9 mc-sm text-left'
                                        },
                                        children: [
                                            {
                                                tag: 'input',
                                                attr: {
                                                    class: 'form-control',
                                                    name: 'Input3',
                                                    type: 'text'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tag: 'div',
                        attr: {
                            'class': 'panel-footer text-right'
                        },
                        children: [
                            {
                                tag: 'button',
                                attr: {
                                    'class': 'btn btn-primary',
                                    contract: 'ContractName'
                                },
                                children: [
                                    {
                                        tag: 'text',
                                        text: 'Send'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
    ,
    'tableWithHeader': {
        tag: 'div',
        attr: {
            'class': 'panel panel-primary'
        },
        children: [
            {
                tag: 'div',
                attr: {
                    'class': 'panel-heading'
                },
                children: [
                    {
                        tag: 'text',
                        text: 'Table block'
                    }
                ]
            },
            {
                tag: 'table',
                attr: {
                    source: 'test_key'
                }
            },
            {
                tag: 'div',
                attr: {
                    'class': 'panel-footer text-right'
                },
                children: [
                    {
                        tag: 'button',
                        attr: {
                            'class': 'btn btn-primary',
                            contract: 'ContractName'
                        },
                        children: [
                            {
                                tag: 'text',
                                text: 'More'
                            }
                        ]
                    }
                ]
            }
        ]
    }
    ,
    'searchForm': {
        tag: 'div',
        attr: {
            'class': 'panel panel-primary'
        },
        children: [
            {
                tag: 'form',
                children: [
                    {
                        tag: 'div',
                        attr: {
                            'class': 'list-group-item'
                        },
                        children: [
                            {
                                tag: 'div',
                                attr: {
                                    'class': 'row df f-valign'
                                },
                                children: [
                                    {
                                        tag: 'div',
                                        attr: {
                                            'class': 'col-md-1 mt-sm text-right'
                                        },
                                        children: [
                                            {
                                                tag: 'label',
                                                attr: {
                                                    'for': 'Search'
                                                },
                                                children: [
                                                    {
                                                        tag: 'span',
                                                        children: [
                                                            {
                                                                tag: 'text',
                                                                text: 'name'
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        tag: 'div',
                                        attr: {
                                            'class': 'col-md-11 mc-sm'
                                        },
                                        children: [
                                            {
                                                tag: 'div',
                                                attr: {
                                                    'class': 'input-group'
                                                },
                                                children: [
                                                    {
                                                        tag: 'input',
                                                        attr: {
                                                            class: 'form-control',
                                                            name: 'Search',
                                                            type: 'text',
                                                            value: '#v_Search#'
                                                        }
                                                    },
                                                    {
                                                        tag: 'div',
                                                        attr: {
                                                            'class': 'input-group-btn'
                                                        },
                                                        children: [
                                                            {
                                                                tag: 'button',
                                                                attr: {
                                                                    'class': 'btn btn-default',
                                                                    page: 'roles_list',
                                                                    pageparams: {
                                                                        isSearch: {
                                                                            text: '1',
                                                                            type: 'text'
                                                                        },
                                                                        v_Search: {
                                                                            params: [
                                                                                'Search'
                                                                            ],
                                                                            type: 'Val'
                                                                        }
                                                                    }
                                                                },
                                                                children: [
                                                                    {
                                                                        tag: 'em',
                                                                        attr: {
                                                                            'class': 'fa fa-search'
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        tag: 'div',
                        attr: {
                            'class': 'list-group-item'
                        },
                        children: [
                            {
                                tag: 'table',
                                attr: {
                                    columns: '$id$=custom_id,$name$=custom_name,$type$=custom_type,$created$ / $deleted$=custom_date,$status$=custom_status,$creator$=custom_creator,$actions$=actions',
                                    source: 'src_roles_list'
                                }
                            }
                        ]
                    },
                    {
                        tag: 'div',
                        attr: {
                            'class': 'panel-footer clearfix'
                        },
                        children: [
                            {
                                tag: 'div',
                                attr: {
                                    'class': 'pull-right'
                                },
                                children: [
                                    {
                                        tag: 'button',
                                        attr: {
                                            'class': 'btn btn-primary',
                                            page: 'roles_create'
                                        },
                                        children: [
                                            {
                                                tag: 'text',
                                                text: 'create'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'radioPanel': {
        tag: 'form',
        attr: {
            'class': 'panel panel-primary'
        },
        children: [
            {
                tag: 'div',
                attr: {
                    'class': 'panel-heading'
                },
                children: [
                    {
                        tag: 'div',
                        attr: {
                            'class': 'panel-title'
                        },
                        children: [
                            {
                                tag: 'text',
                                text: 'Payment'
                            }
                        ]
                    }
                ]
            },
            {
                tag: 'div',
                attr: {
                    'class': 'panel-body'
                },
                children: [
                    {
                        tag: 'div',
                        attr: {
                            'class': 'form-group'
                        },
                        children: [
                            {
                                tag: 'label',
                                children: [
                                    {
                                        tag: 'text',
                                        text: 'Payment methods'
                                    }
                                ]
                            },
                            {
                                tag: 'radiogroup',
                                attr: {
                                    name: 'Payments',
                                    namecolumn: 'type',
                                    source: 'payment',
                                    value: '#value_payment_method#',
                                    valuecolumn: 'id'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                tag: 'div',
                attr: {
                    'class': 'panel-footer text-center'
                },
                children: [
                    {
                        tag: 'button',
                        attr: {
                            alert: {
                                text: 'Select the payment method'
                            },
                            'class': 'btn btn-default mr-lg',
                            contract: 'ContractName'
                        },
                        children: [
                            {
                                tag: 'text',
                                text: 'Cancel'
                            }
                        ]
                    },
                    {
                        tag: 'button',
                        attr: {
                            'class': 'btn btn-primary',
                            contract: 'ContractName',
                            page: 'proof_payment'
                        },
                        children: [
                            {
                                tag: 'text',
                                text: 'Payment'
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

export default function getConstructorTemplate(name: string) {
    let template = copyObject(constructorTemplates[name]);
    template.id = idGenerator.generateId();
    if (template.children) {
        setIds(template.children, true);
    }
    return template;
}