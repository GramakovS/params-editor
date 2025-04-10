import { Component, createRef, FC, useState } from 'react';
import './styles.css';

export interface Param {
  id: number;
  name: string;
  type: 'string';
}

export interface ParamValue {
  paramId: number;
  value: string;
}

export interface Color {
  id: number;
  name: string;
}

export interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

interface Props {
  params: Param[];
  model: Model;
}

interface State {
  currentParamValues: ParamValue[];
}

export const ParamField: FC<{
  name: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ name, value, onChange }) => {
  return (
    <div className="param-row">
      <div className="param-name">{name}</div>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="param-input" />
    </div>
  );
};

export class ParamEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentParamValues: [...props.model.paramValues],
    };
  }

  handleParamChange = (paramId: number, value: string) => {
    const { currentParamValues } = this.state;

    const existingValueIndex = currentParamValues.findIndex((paramValue) => paramValue.paramId === paramId);

    if (existingValueIndex !== -1) {
      const updatedParamValues = [...currentParamValues];
      updatedParamValues[existingValueIndex] = { paramId, value };
      this.setState({ currentParamValues: updatedParamValues });
    } else {
      this.setState({
        currentParamValues: [...currentParamValues, { paramId, value }],
      });
    }
  };

  public getModel(): Model {
    const filteredParamValues = this.state.currentParamValues.filter((paramValue) =>
      this.props.params.some((param) => param.id === paramValue.paramId),
    );

    return {
      ...this.props.model,
      paramValues: filteredParamValues,
    };
  }

  render() {
    const { params } = this.props;
    const { currentParamValues } = this.state;

    return (
      <div className="param-editor">
        {params.map((param) => {
          const paramValue = currentParamValues.find((value) => value.paramId === param.id);

          return (
            <ParamField
              key={param.id}
              name={param.name}
              value={paramValue ? paramValue.value : ''}
              onChange={(value) => this.handleParamChange(param.id, value)}
            />
          );
        })}
      </div>
    );
  }
}

export const ParamEditorDemo: FC = () => {
  const exampleParams: Param[] = [
    {
      id: 1,
      name: 'Назначение',
      type: 'string',
    },
    {
      id: 2,
      name: 'Длина',
      type: 'string',
    },
  ];

  const exampleModel: Model = {
    paramValues: [
      {
        paramId: 1,
        value: 'повседневное',
      },
      {
        paramId: 2,
        value: 'макси',
      },
    ],
    colors: [],
  };

  const [model, setModel] = useState<Model>(exampleModel);
  const editorRef = createRef<ParamEditor>();

  const handleGetModel = () => {
    if (editorRef.current) {
      const updatedModel = editorRef.current.getModel();
      setModel(updatedModel);
    }
  };

  return (
    <div className="param-editor-demo">
      <h2>Редактор параметров</h2>
      <ParamEditor ref={editorRef} params={exampleParams} model={model} />
      <button onClick={handleGetModel} className="get-model-button">
        Получить модель
      </button>
      <div className="model-display">
        <h3>Текущая модель:</h3>
        <pre>{JSON.stringify(model, null, 2)}</pre>
      </div>
    </div>
  );
};
