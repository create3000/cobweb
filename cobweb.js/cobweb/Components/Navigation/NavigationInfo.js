
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DBindableNode",
	"cobweb/Bits/TraverseType",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DBindableNode,
          TraverseType,
          X3DConstants)
{
	with (Fields)
	{
		var TransitionType =
		{
			TELEPORT: true,
			LINEAR:   true,
			ANIMATE:  true,
		};

		function NavigationInfo (executionContext)
		{
			X3DBindableNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .NavigationInfo);
		}

		NavigationInfo .prototype = $.extend (Object .create (X3DBindableNode .prototype),
		{
			constructor: NavigationInfo,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",           new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,   "set_bind",           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "type",               new MFString ([ "EXAMINE", "ANY" ])),
				new X3DFieldDefinition (X3DConstants .inputOutput, "avatarSize",         new MFFloat ([ 0.25, 1.6, 0.75 ])),
				new X3DFieldDefinition (X3DConstants .inputOutput, "speed",              new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "headlight",          new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "visibilityLimit",    new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "transitionType",     new MFString ("LINEAR")),
				new X3DFieldDefinition (X3DConstants .inputOutput, "transitionTime",     new SFTime (1)),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "transitionComplete", new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "isBound",            new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,  "bindTime",           new SFTime ()),
			]),
			getTypeName: function ()
			{
				return "NavigationInfo";
			},
			getComponentName: function ()
			{
				return "Navigation";
			},
			getContainerField: function ()
			{
				return "children";
			},
			initialize: function ()
			{
				X3DBindableNode .prototype .initialize .call (this);

				this .headlight_ .addInterest (this, "set_headlight__");
				
				this .set_headlight__ ();
			},
			set_headlight__: function ()
			{
				if (this .headlight_ .getValue ())
					this .enable = enable;
				else
					delete this .enable;
			},
			bindToLayer: function (layer)
			{
				X3DBindableNode .prototype .bindToLayer .call (this, layer);
			
				layer .getNavigationInfoStack () .push (this);
			},
			unbindFromLayer: function (layer)
			{
				X3DBindableNode .prototype .unbindFromLayer .call (this, layer);

				layer .getNavigationInfoStack () .pop (this);
			},
			removeFromLayer: function (layer)
			{
				layer .getNavigationInfoStack () .remove (this);
			},
			getCollisionRadius: function ()
			{
				if (this .avatarSize_ .length > 0)
				{
					if (this .avatarSize_ [0] > 0)
						return this .avatarSize_ [0];
				}

				return 0.25;
			},
			getAvatarHeight: function ()
			{
				if (this .avatarSize_ .length > 1)
					return this .avatarSize_ [1];

				return 1.6;
			},
			getStepHeight: function ()
			{
				if (this .avatarSize_ .length > 2)
					return this .avatarSize_ [2];

				return 0.75;
			},
			getNearPlane: function ()
			{
				var zNear = this .getCollisionRadius ();

				if (zNear === 0)
					return 1e-5;

				else
					return zNear / 2;
			},
			getFarPlane: function (viewpoint)
			{
				return this .visibilityLimit_ .getValue ()
					    ? this .visibilityLimit_ .getValue ()
					    : viewpoint .getMaxZFar ();
			},
			getTransitionType: function ()
			{
				for (var i = 0, length = this .transitionType_ .length; i < length; ++ i)
				{
					var
						value          = this .transitionType_ [i],
						transitionType = TransitionType [value];

					if (transitionType)
						return value;
				}

				return "LINEAR";
			},
			enable: function ()
			{
			},
			traverse: function (type)
			{
				if (type === TraverseType .CAMERA)
					this .getCurrentLayer () .getNavigationInfos () .push (this);
			}
		});

		function enable ()
		{
			this .getBrowser () .getGlobalLights () .push (this .getBrowser () .getHeadlight ());
		}

		return NavigationInfo;
	}
});

