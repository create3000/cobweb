
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Components/Grouping/X3DBoundedObject",
	"cobweb/Components/Grouping/Group",
	"cobweb/Bits/X3DConstants",
	"cobweb/InputOutput/Loader",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode,
          X3DUrlObject,
          X3DBoundedObject,
          Group,
          X3DConstants,
          Loader)
{
	with (Fields)
	{
		function Inline (executionContext)
		{
			X3DChildNode     .call (this, executionContext .getBrowser (), executionContext);
			X3DUrlObject     .call (this, executionContext .getBrowser (), executionContext);
			X3DBoundedObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Inline);

			this .scene    = this .getBrowser () .getDefaultScene ();
			this .group    = new Group (executionContext);
			this .traverse = this .group .traverse .bind (this .group);
		}

		Inline .prototype = $.extend (new X3DChildNode (),
			X3DUrlObject .prototype,
			X3DBoundedObject .prototype,
		{
			constructor: Inline,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "load",       new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "url",        new MFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",   new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter", new SFVec3f ()),
			]),
			getTypeName: function ()
			{
				return "Inline";
			},
			getComponentName: function ()
			{
				return "Networking";
			},
			getContainerField: function ()
			{
				return "children";
			},
			initialize: function ()
			{
				X3DChildNode     .prototype .initialize .call (this);
				X3DUrlObject     .prototype .initialize .call (this);
				X3DBoundedObject .prototype .initialize .call (this);

				this .group .setup ();

				this .load ();
			},
			load: function ()
			{
				if (this .getExecutionContext () === this .getBrowser () .getExecutionContext ())
					this .requestImmediateLoad ();
				else
					setTimeout (this .requestAsyncLoad .bind (this), 0);
			},
			requestImmediateLoad: function ()
			{
				console .log (this .url_ [0]);

				try
				{
					this .setScene (new Loader (this .getExecutionContext ()) .createX3DFromURL (this .url_));
				}
				catch (error)
				{
					console .log (error);
					this .setScene (this .getBrowser () .getDefaultScene ());
				}
			},
			requestAsyncLoad: function ()
			{
				new Loader (this .getExecutionContext ()) .createX3DFromURL (this .url_, this .setScene .bind (this));
			},
			setScene: function (scene)
			{
				this .scene .rootNodes .removeInterest (this .group .children_, "setValue");

				// Set new scene.

				this .scene = scene;
				this .scene .setup ();

				this .scene .rootNodes .addInterest (this .group .children_, "setValue");
				this .group .children_ = this .scene .rootNodes;

				this .getBrowser () .addBrowserEvent ();
			},
			getScene: function ()
			{
				return this .scene;
			},
		});

		return Inline;
	}
});
