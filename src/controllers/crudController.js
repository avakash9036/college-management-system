import { asyncHandler } from '../utils/asyncHandler.js';

function wantsHtml(req) {
  return req.accepts(['html', 'json']) === 'html';
}

function getFields(Model) {
  return Object.entries(Model.rawAttributes)
    .filter(([name, attribute]) => {
      if (attribute.autoIncrement) return false;
      if (['id', 'createdAt', 'updatedAt'].includes(name)) return false;
      if (['passwordHash', 'refreshToken'].includes(name)) return false;
      return true;
    })
    .map(([name, attribute]) => ({
      name,
      label: name.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()),
      required: attribute.allowNull === false && attribute.defaultValue === undefined,
      values: attribute.values || [],
      type: attribute.type?.key || 'STRING'
    }));
}

function getValue(row, path) {
  return path.split('.').reduce((value, key) => value?.[key], row);
}

function normalizeBody(body) {
  return Object.fromEntries(
    Object.entries(body).map(([key, value]) => [key, value === '' ? null : value])
  );
}

export function crudController(Model, options = {}) {
  const include = options.include || [];
  const formFields = options.formFields || getFields(Model);
  const displayFields = options.displayFields || formFields.slice(0, 6);

  return {
    list: asyncHandler(async (req, res) => {
      const rows = await Model.findAll({ include, order: [['createdAt', 'DESC']] });
      if (wantsHtml(req)) {
        return res.render('crud-list', {
          title: Model.name,
          modelName: Model.name,
          rows,
          fields: formFields,
          displayFields,
          getValue,
          basePath: req.baseUrl + req.path
        });
      }
      res.json(rows);
    }),

    get: asyncHandler(async (req, res) => {
      const row = await Model.findByPk(req.params.id, { include });
      if (!row) return res.status(404).json({ message: `${Model.name} not found` });
      return res.json(row);
    }),

    create: asyncHandler(async (req, res) => {
      const row = await Model.create(normalizeBody(req.body));
      if (wantsHtml(req)) return res.redirect(req.originalUrl);
      res.status(201).json(row);
    }),

    update: asyncHandler(async (req, res) => {
      const row = await Model.findByPk(req.params.id);
      if (!row) return res.status(404).json({ message: `${Model.name} not found` });
      await row.update(normalizeBody(req.body));
      if (wantsHtml(req)) return res.redirect(req.baseUrl + req.path.replace(`/${req.params.id}`, ''));
      return res.json(row);
    }),

    remove: asyncHandler(async (req, res) => {
      const row = await Model.findByPk(req.params.id);
      if (!row) return res.status(404).json({ message: `${Model.name} not found` });
      await row.destroy();
      if (wantsHtml(req)) return res.redirect(req.baseUrl + req.path.replace(`/${req.params.id}`, ''));
      return res.status(204).send();
    })
  };
}
