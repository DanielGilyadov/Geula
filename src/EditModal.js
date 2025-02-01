import React from 'react';
import { Modal, Input, Button, Checkbox } from 'antd';

const EditModal = ({
  visible,
  editingPerson,
  onCancel,
  onSave,
  onChange,
}) => {
  if (!editingPerson) {
    return null; // Не рендерим, если данных для редактирования нет
  }

  return (
    <Modal
      title="Редактировать информацию"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Отмена
        </Button>,
        <Button key="save" type="primary" onClick={onSave}>
          Сохранить изменения
        </Button>,
      ]}
    >
      <div>
        <Input
          value={editingPerson.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Имя"
          style={{ marginBottom: 10 }}
        />
        <Input
          value={editingPerson.familyName}
          onChange={(e) => onChange('familyName', e.target.value)}
          placeholder="Фамилия"
          style={{ marginBottom: 10 }}
        />
        <Input
          value={editingPerson.fathersName}
          onChange={(e) => onChange('fathersName', e.target.value)}
          placeholder="Отчество"
          style={{ marginBottom: 10 }}
        />
        <Input
          value={editingPerson.age}
          onChange={(e) => onChange('age', e.target.value)}
          placeholder="Возраст"
          style={{ marginBottom: 10 }}
        />
        <Input
          value={editingPerson.importantDate}
          onChange={(e) => onChange('importantDate', e.target.value)}
          placeholder="Важная дата"
          style={{ marginBottom: 10 }}
        />
        <Input
          value={editingPerson.importantDateDiscription}
          onChange={(e) => onChange('importantDateDiscription', e.target.value)}
          placeholder="Описание даты"
          style={{ marginBottom: 10 }}
        />
        <Checkbox
          checked={editingPerson.tfilin}
          onChange={(e) => onChange('tfilin', e.target.checked)}
          style={{ marginBottom: 10 }}
        >
          Наличие тфилина
        </Checkbox>
        <Checkbox
          checked={editingPerson.student}
          onChange={(e) => onChange('student', e.target.checked)}
          style={{ marginBottom: 10 }}
        >
          Участвовал в семинарах
        </Checkbox>
        <Checkbox
          checked={editingPerson.shabbat}
          onChange={(e) => onChange('shabbat', e.target.checked)}
          style={{ marginBottom: 10 }}
        >
          Соблюдает шаббат
        </Checkbox>
      </div>
    </Modal>
  );
};

export default EditModal;
