import React, { useState } from 'react';
import classnames from 'classnames';
import Select2 from "react-select2-wrapper";
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";
import { formatDate, formatDateAmerican } from "../../../../utils/conversor";

import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col,
    UncontrolledTooltip,
    Table
} from "reactstrap";

registerLocale('pt-br', ptBR);

const RenderRowList = (props) => {
    const { data, index, deleteChange, editChange } = props;
    return (
    <tr>
            <td className="table-user">
                {data.field}
            </td>
            <td>
                <span className="text-muted">
                    {data.type === "boolean" ? data.value ? "YES" : "NO" : 
                    data.type === "date" ? formatDate(data.value) :
                    data.value}
                </span>
            </td>
            <td className="table-actions">
                <a
                className="table-action"
                href="#edit"
                id={`change-${index}-edit`}
                onClick={(e) => {
                    e.preventDefault();
                    editChange(index);
                }}
                >
                    <i className="fas fa-user-edit" />
                </a>
                <UncontrolledTooltip delay={0} target={`change-${index}-edit`}>
                    Edit change
                </UncontrolledTooltip>
                <a
                className="table-action table-action-delete"
                href="#delete"
                id={`change-${index}-delete`}
                onClick={(e) => {
                    e.preventDefault();
                    deleteChange(index);
                }}
                >
                    <i className="fas fa-trash" />
                </a>
                <UncontrolledTooltip delay={0} target={`change-${index}-delete`}>
                    Delete change
                </UncontrolledTooltip>
            </td>
        </tr>
    )
}

const ChangesComponent = (props) => {
    const { stateList, setListState, filterFields, orderStatus, weList, notify } = props;

    const optionsData = filterFields.map((filterItem) => filterItem[1]);
    const statusNames = orderStatus.map((status) => status.name);

    const [ changeValueFocus, setChangeValueFocus ] = useState(false);
    const [ changeState, setChangeState ] = useState({
        changeField: "",
        changeValue: "",
    });
    const [ inputType, setInputType ] = useState();
    const [ selectField, setSelectField ] = useState();

    const handlerInput = (e) => {
        if (Object.keys(e).length === 0) return setChangeState({...changeState, "changeValue": formatDateAmerican(e)});

        const inputName = e.target.name;
        const inputValue = e.target.type === "checkbox" ? e.target.checked : e.target.value;

        if (inputName === "changeField"){
            const filterObject = filterFields.filter((filterItem) => filterItem[1] === inputValue)[0]
            setInputType(filterObject.length === 2 ? "string" : filterObject[2]);
            if ( inputValue === "Color" ) setSelectField("color");
            if ( inputValue === "Status" ) setSelectField("status");
            if ( inputValue === "Prevision Fat. (Week)" ) setSelectField("week");
        }

        setChangeState({...changeState, [inputName]: inputValue});
    }

    const clearFilterInputValue = () => {
        setChangeState({...changeState, "changeValue": ""});
    }

    const addChange = () => {
        if (changeState.changeField.length === 0) return notify({message: "Please, select a field and insert a value to add change.", title: "Attention"});
        if ((!(changeState.changeValue) || String(changeState.changeValue).length === 0) && inputType !== "boolean") return notify({message: "Please, insert a value and try add again.", title: "Attention"})

        const changesListCopy = [...stateList];

        if((changesListCopy.filter((change) => change.field === changeState.changeField)).length > 0) return notify({message: "This change has already been added!", title: "Attention"})

        if (inputType !== "boolean") changesListCopy.push({ field: changeState.changeField, value: changeState.changeValue, type: inputType, fieldType: selectField });
        if (inputType === "boolean") changesListCopy.push({ field: changeState.changeField, value: changeState.changeValue ? true : false, type: inputType, fieldType: selectField });

        setListState(changesListCopy);
        setChangeState({
            changeField: "",
            changeValue: ""
        });
        setInputType(null);
        setSelectField(null);
    }

    const deleteChange = (index) => {
        const changesCopy = [...stateList];
        changesCopy.splice(index, 1);
        setListState(changesCopy);
    }

    const editChange = (index) => {
        const changeChanged = stateList[index];
        setChangeState({
            changeField: changeChanged.field,
            changeValue: changeChanged.value
        });
        setInputType(changeChanged.type);
        setSelectField(changeChanged.fieldType);
        deleteChange(index);
    }

    return (
        <>
        <Card>
            <CardHeader>
                <h3 className="mb-0">Changes:</h3>
            </CardHeader>
            <CardBody>
                <Form onSubmit={(e) => e.preventDefault()}>
                    <Row>
                        <Col xs={12} sm={3}>
                            <label className="form-control-label">
                                Field:
                            </label>
                            <FormGroup>
                                <Select2
                                    className="form-control"
                                    name="changeField"
                                    options={{ placeholder: "Select a field" }}
                                    onSelect={handlerInput}
                                    data={optionsData}
                                    value={changeState.changeField}
                                    multiple={false}
                                    onOpen={() => {
                                        const select2 = document.getElementsByClassName('select2-search__field');
                                        select2[0].focus();
                                    }}
                                    onClose={() => {
                                        const body = document.querySelector("body");
                                        body.tabIndex = 0;
                                        body.focus();
                                    }}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                            <label className="form-control-label">
                                Value:
                            </label>
                            <FormGroup>
                                {inputType === "string" ? (
                                    <InputGroup
                                        className={classnames("input-group-merge", {
                                        focused: changeValueFocus,
                                        })}
                                    >
                                        <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-bold-right" />
                                        </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                        placeholder="Type the value here:"
                                        type="text"
                                        name="changeValue"
                                        onFocus={() => setChangeValueFocus(true)}
                                        onBlur={() => setChangeValueFocus(false)}
                                        onChange={handlerInput}
                                        value={changeState.changeValue}
                                        />
                                    </InputGroup>
                                ) : inputType === "boolean" ? (
                                    <div className="custom-control custom-checkbox mb-3">
                                        <input
                                            className="custom-control-input"
                                            id="changeValue"
                                            type="checkbox"
                                            name="changeValue"
                                            onClick={handlerInput}
                                            defaultChecked={changeState.changeValue ? true : false}
                                        />
                                        <label
                                            className="custom-control-label"
                                            htmlFor="changeValue"
                                        >
                                            Value
                                        </label>
                                    </div>
                                ) : inputType === "date" ? (
                                    <div id='duelist-filter-input-select-status' onDoubleClick={clearFilterInputValue}>
                                        <InputGroup
                                            className={classnames("input-group-merge")}
                                        >
                                            <DatePicker
                                            type="date"
                                            locale="pt-br"
                                            onChange={handlerInput}
                                            value={formatDate(changeState.changeValue)}
                                            dateFormat="dd/MM/yyyy"
                                            isClearable={true}
                                            />
                                        </InputGroup>
                                    </div>
                                ) : inputType === "select" ? (
                                    <FormGroup>
                                        {selectField === "color" ? (
                                            <Select2
                                                className="form-control"
                                                name="changeValue"
                                                options={{ placeholder: "Select a order color:" }}
                                                onSelect={handlerInput}
                                                data={[
                                                    'Green',
                                                    'Yellow',
                                                    'White'
                                                ]}
                                                value={changeState.changeValue}
                                                onOpen={() => {
                                                    const select2 = document.getElementsByClassName('select2-search__field');
                                                    select2[0].focus();
                                                }}
                                                onClose={() => {
                                                    const body = document.querySelector("body");
                                                    body.tabIndex = 0;
                                                    body.focus();
                                                }}
                                            />
                                        ) :
                                        selectField === "week" ? (
                                            <Select2
                                                className="form-control"
                                                name="changeValue"
                                                options={{ placeholder: "Select a order week:" }}
                                                onSelect={handlerInput}
                                                data={weList}
                                                value={changeState.changeValue}
                                                onOpen={() => {
                                                    const select2 = document.getElementsByClassName('select2-search__field');
                                                    select2[0].focus();
                                                }}
                                                onClose={() => {
                                                    const body = document.querySelector("body");
                                                    body.tabIndex = 0;
                                                    body.focus();
                                                }}
                                            />
                                        ) :
                                        selectField === "status" && (
                                            <Select2
                                                className="form-control"
                                                name="changeValue"
                                                options={{ placeholder: "Select a order status:" }}
                                                onSelect={handlerInput}
                                                data={statusNames}
                                                value={changeState.changeValue}
                                                onOpen={() => {
                                                    const select2 = document.getElementsByClassName('select2-search__field');
                                                    select2[0].focus();
                                                }}
                                                onClose={() => {
                                                    const body = document.querySelector("body");
                                                    body.tabIndex = 0;
                                                    body.focus();
                                                }}
                                            />
                                        )}
                                    </FormGroup>
                                ) : inputType === "number" && (
                                    <InputGroup
                                        className={classnames("input-group-merge", {
                                        focused: changeValueFocus,
                                        })}
                                    >
                                        <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-bold-right" />
                                        </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                        placeholder="Type the value here:"
                                        type="number"
                                        name="changeValue"
                                        onFocus={() => setChangeValueFocus(true)}
                                        onBlur={() => setChangeValueFocus(false)}
                                        onChange={handlerInput}
                                        value={changeState.changeValue}
                                        />
                                    </InputGroup>
                                )}
                            </FormGroup>
                        </Col>
                        <Col>
                            <label className="form-control-label">&nbsp;</label>
                            <FormGroup>
                                <Button color="default" size="md" type="button" outline={true} onClick={addChange}>
                                    Add
                                </Button>
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
            </CardBody>
        </Card>
        <Card>
          <CardHeader className="border-0">
            <Row>
              <Col xs="6">
                <h3 className="mb-0">Prepareds:</h3>
              </Col>
            </Row>
          </CardHeader>

            <div className='my-custom-div-table'>
            <Table className="align-items-center table-flush" responsive>
            <thead className="thead-light">
              <tr>
                <th>Field</th>
                <th>Value</th>
                <th />
              </tr>
            </thead>
            <tbody>
                {stateList ? stateList.map((change, index) => (<RenderRowList data={change} index={index} key={`change-${index}-item`} deleteChange={deleteChange} editChange={editChange}/>)) : null}
            </tbody>
          </Table>
          </div>
        </Card>
        </>
    )
}

export default ChangesComponent;