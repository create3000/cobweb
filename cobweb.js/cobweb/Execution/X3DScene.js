
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Execution/X3DExecutionContext",
	"cobweb/Configuration/UnitInfo",
	"cobweb/Configuration/UnitInfoArray",
	"cobweb/Execution/ExportedNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DExecutionContext,
          UnitInfo,
          UnitInfoArray,
          ExportedNode,
          X3DConstants)
{
"use strict";

	function X3DScene (executionContext)
	{
		X3DExecutionContext .call (this, executionContext);

		this .getRootNodes () .setAccessType (X3DConstants .inputOutput);

		this .units = new UnitInfoArray ();

		this .units .add ("angle",  new UnitInfo ("angle",  "radian",   1));
		this .units .add ("force",  new UnitInfo ("force",  "newton",   1));
		this .units .add ("length", new UnitInfo ("length", "metre",    1));
		this .units .add ("mass",   new UnitInfo ("mass",   "kilogram", 1));

		this .metaData      = { };
		this .exportedNodes = { };
	}

	X3DScene .prototype = $.extend (Object .create (X3DExecutionContext .prototype),
	{
		constructor: X3DScene,
		isRootContext: function ()
		{
			return true;
		},
		updateUnit: function (category, name, conversionFactor)
		{
			var unit = this .units .get (category);

			if (! unit)
				return;

			unit .name             = name;
			unit .conversionFactor = conversionFactor;
		},
		setMetaData: function (name, value)
		{
			if (! name .length)
				return;

			this .metaData [name] = String (value);
		},
		getMetaData: function (name)
		{
			return this .metaData [name];
		},
		addExportedNode: function (exportedName, node)
		{
			if (this .exportedNodes [exportedName])
				throw new Error ("Couldn't add exported node: exported name '" + exportedName + "' already in use.");

			this .updateExportedNode (exportedName, node);
		},
		updateExportedNode: function (exportedName, node)
		{
			exportedName = String (exportedName);

			if (exportedName .length === 0)
				throw new Error ("Couldn't update exported node: node exported name is empty.");

			if (! (node instanceof Fields .SFNode))
				throw new Error ("Couldn't update exported node: node must be of type SFNode.");

			if (! node .getValue ())
				throw new Error ("Couldn't update exported node: node IS NULL.");

			//if (node .getValue () .getExecutionContext () !== this)
			//	throw new Error ("Couldn't update exported node: node does not belong to this execution context.");

			this .exportedNodes [exportedName] = new ExportedNode (exportedName, node .getValue ());
		},
		removeExportedNode: function (exportedName)
		{
			delete this .exportedNodes [exportedName];
		},
		getExportedNode: function (exportedName)
		{
			var exportedNode = this .exportedNodes [exportedName];

			if (exportedNode)
				return exportedNode .getLocalNode ();	

			throw new Error ("Exported node '" + exportedName + "' not found.");
		},
		setRootNodes: function (value)
		{
			this .getRootNodes () .setValue (value);
		},
	});

	return X3DScene;
});
