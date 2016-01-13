
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DBaseNode,
          X3DConstants)
{
"use strict";

	function ImportedNode (executionContext, inlineNode, exportedName, importedName)
	{
		X3DBaseNode .call (this, executionContext);

		this .inlineNode   = inlineNode;
		this .exportedName = exportedName;
		this .importedName = importedName;
		this .routes       = { };

		this .inlineNode .loadState_ .addInterest (this, "set_loadState__");
	}

	ImportedNode .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: ImportedNode,
		getTypeName: function ()
		{
			return "ImportedNode";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "importedNodes";
		},
		getInlineNode: function ()
		{
			return this .inlineNode;
		},
		getExportedName: function ()
		{
			return this .exportedName;
		},
		getExportedNode: function ()
		{
			return this .inlineNode .getScene () .getExportedNode (this .exportedName);
		},
		getImportedName: function ()
		{
			return this .importedName;
		},
		addRoute: function (sourceNode, sourceField, destinationNode, destinationField)
		{
			// Add route.

			var id = sourceNode .getId () + "." + sourceField + " " + destinationNode .getId () + "." + destinationField;

			this .routes [id] =
			{
				sourceNode:       sourceNode,
				sourceField:      sourceField,
				destinationNode:  destinationNode,
				destinationField: destinationField,
			};

			// Try to resolve source or destination node.

			if (this .inlineNode .checkLoadState () === X3DConstants .COMPLETE_STATE)
				return this .resolveRoute (id);
		},
		resolveRoute: function (id)
		{
			try
			{
				var
					route            = this .routes [id],
					sourceNode       = route .sourceNode,
					sourceField      = route .sourceField,
					destinationNode  = route .destinationNode,
					destinationField = route .destinationField;

				if (route ._route)
					route ._route .disconnect ();

				if (sourceNode instanceof ImportedNode)
					sourceNode = sourceNode .getExportedNode () .getValue ();

				if (destinationNode instanceof ImportedNode)
					destinationNode = destinationNode .getExportedNode () .getValue ();

				return route ._route = this .getExecutionContext () .addRoute (new Fields .SFNode (sourceNode), sourceField, new Fields .SFNode (destinationNode), destinationField);
			}
			catch (error)
			{
				console .error (error .message);
			}
		},
		deleteRoutes: function ()
		{
			var routes = this .routes;

			for (var id in routes)
			{
				var route = routes [id];

				if (route ._route)
				{
					this .getExecutionContext () .deleteRoute (route ._route);
					delete route ._route;
				}
			}
		},
		set_loadState__: function ()
		{
			switch (this .inlineNode .checkLoadState ())
			{
				case X3DConstants .NOT_STARTED_STATE:
				case X3DConstants .FAILED_STATE:
				{
					this .deleteRoutes ();
					break;
				}
				case X3DConstants .COMPLETE_STATE:
				{
					this .deleteRoutes ();

					try
					{
						var routes = this .routes;

						for (var id in routes)
							this .resolveRoute (id);
					}
					catch (error)
					{
						console .error (error);
					}

					break;
				}
			}
		},
		dispose: function ()
		{
			this .inlineNode .loadState_ .removeInterest (this, "set_loadState__");

			this .deleteRoutes ();

			X3DBaseNode .prototype .dispose .call (this);
		},
	});

	return ImportedNode;
});
