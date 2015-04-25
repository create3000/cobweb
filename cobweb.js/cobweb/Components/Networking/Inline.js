
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
			
			this .addChildren ("buffer", new SFTime ());

			this .scene    = this .getBrowser () .getDefaultScene ();
			this .group    = new Group (executionContext);
			this .getBBox  = this .group .getBBox  .bind (this .group);
			this .traverse = this .group .traverse .bind (this .group);
		}

		Inline .prototype = $.extend (Object .create (X3DChildNode .prototype),
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

				this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
				this .isLive () .addInterest (this, "set_live__");

				this .group .setup ();
				this .group .isCameraObject_ .addFieldInterest (this .isCameraObject_);

				this .load_   .addInterest (this, "set_load__");
				this .url_    .addInterest (this, "set_url__");
				this .buffer_ .addInterest (this, "set_buffer__");

				this .requestAsyncLoad ();
			},
			set_live__: function ()
			{
				if (this .checkLoadState () == X3DConstants .COMPLETE_STATE)
				{
					var live = this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ();

					if (live !== this .scene .isLive () .getValue ())
						this .scene .isLive () .setValue (live);
				}
			},
			set_load__: function ()
			{
				if (this .load_ .getValue ())
					this .buffer_ .addEvent ();

				else
					this .requestUnload ();
			},
			set_url__: function ()
			{
				this .buffer_ .addEvent ();
			},
			set_buffer__: function ()
			{
				if (! this .load_ .getValue ())
					return;

				this .setLoadState (X3DConstants .NOT_STARTED_STATE);

				this .requestAsyncLoad ();
			},
			requestImmediateLoad: function ()
			{
				try
				{
					this .setScene (new Loader (this) .createX3DFromURL (this .url_));
				}
				catch (error)
				{
					console .log (error);
					this .setScene (this .getBrowser () .getDefaultScene ());
				}
			},
			requestAsyncLoad: function ()
			{
				if (this .checkLoadState () === X3DConstants .COMPLETE_STATE || this .checkLoadState () === X3DConstants .IN_PROGRESS_STATE)
					return;

				this .setLoadState (X3DConstants .IN_PROGRESS_STATE);

				new Loader (this) .createX3DFromURL (this .url_, this .setSceneAsync .bind (this));
			},
			requestUnload: function ()
			{
				if (this .checkLoadState () === X3DConstants .NOT_STARTED_STATE || this .checkLoadState () === X3DConstants .FAILED_STATE)
					return;

				this .setLoadState (X3DConstants .NOT_STARTED_STATE);
				this .setScene (this .getBrowser () .getDefaultScene ());
			},
			setSceneAsync: function (scene)
			{
				if (scene)
				{
					this .setScene (scene);
					this .setLoadState (X3DConstants .COMPLETE_STATE);
				}
				else
				{
					this .setScene (this .getBrowser () .getDefaultScene ());
					this .setLoadState (X3DConstants .FAILED_STATE);
				}
			},
			setScene: function (scene)
			{
				this .scene .endUpdate ();
				this .scene .rootNodes .removeInterest (this .group .children_, "setValue");

				// Set new scene.

				this .scene = scene;
				this .scene .setup ();

				//this .scene .setExecutionContext (this .getExecutionContext ());
				this .scene .rootNodes .addInterest (this .group .children_, "setValue");
				this .group .children_ = this .scene .rootNodes;

				this .set_live__ ();

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
