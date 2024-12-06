import React from 'react'

const InputEmployeeEdit = ({ label, name, onChange, value, styles }) => {
    return (
        <div className={styles.inputDetails}>
            <label className={styles.inputLabel}>{label}</label>
            <input
                className={styles.input}
                type="text"
                name={name}
                value={value || ""}
                onChange={(e) => onChange(e.target.name, e.target.value)}
            />
        </div>
    );
};

export default InputEmployeeEdit